
import axios from 'axios';
import { PaginatedBankLogResponse } from '@/lib/types/statement.types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';
const backendApi = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const getStatementHistory = async (
  searchParams: { [key: string]: string | string[] | undefined },
  token?: string
): Promise<PaginatedBankLogResponse> => {
  try {
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
    return response.data; 

  } catch (error: any) {
    console.error('[Statement API] Lỗi khi lấy lịch sử sao kê:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      baseURL: BACKEND_URL,
      url: '/api/statements/history',
    });
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
    if (error.code === 'ECONNREFUSED') {
    }
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