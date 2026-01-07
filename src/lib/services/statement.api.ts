// lib/services/statement.api.ts

import axios from 'axios';
import { PaginatedBankLogResponse } from '@/lib/types/statement.types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

// Tạo axios instance riêng cho backend API
const backendApi = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

/**
 * Lấy lịch sử tải lên sao kê từ backend, hỗ trợ phân trang.
 * Backend API: {{backendURL}}/api/statements/history?page=1&limit=10
 * Yêu cầu Bearer Token để xác thực
 */
export const getStatementHistory = async (
  searchParams: { [key: string]: string | string[] | undefined },
  token?: string
): Promise<PaginatedBankLogResponse> => {
  try {
    // Lấy giá trị từ searchParams (là object, không phải URLSearchParams)
    const page = Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page;
    const limit = Array.isArray(searchParams.limit) ? searchParams.limit[0] : searchParams.limit;
    
    const response = await backendApi.get('/api/statements/history', {
      params: {
        page: page || '1',
        limit: limit || '10',
      },
      headers: token ? {
        'Authorization': `Bearer ${token}`,
      } : {},
    });
    
    // API của bạn đã trả về đúng cấu trúc PaginatedBankLogResponse
    return response.data; 

  } catch (error: any) {
    console.error('[Statement API] Lỗi khi lấy lịch sử sao kê:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      baseURL: BACKEND_URL,
      url: '/api/statements/history',
    });
    
    // Kiểm tra lỗi xác thực
    if (error.response?.status === 403 || error.response?.status === 401) {
      console.error('[Statement API] ❌ Lỗi xác thực (403/401)');
      console.error('[Statement API] 💡 Token không hợp lệ hoặc đã hết hạn');
      return {
        success: false,
        data: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalDocuments: 0,
          limit: 10
        },
        error: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
      } as PaginatedBankLogResponse;
    }
    
    // Kiểm tra lỗi kết nối
    if (error.code === 'ECONNREFUSED') {
    }
    
    // Trả về cấu trúc lỗi để trang không bị crash
    return {
      success: false,
      data: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalDocuments: 0,
        limit: 10
      },
      error: error.message || 'Không thể kết nối backend'
    } as PaginatedBankLogResponse;
  }
};