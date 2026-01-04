// lib/types/statement.types.ts

/**
 * Đại diện cho một bản ghi trong lịch sử tải lên (BankLog).
 * Phải khớp với cấu trúc `bankLog.model.js` của backend.
 */
export interface BankLog {
  _id: string;
  filename: string;
  size: number;
  status: 'thành công' | 'thất bại';
  bank: 'MBBank' | 'BIDV' | string; // Thêm 'string' để linh hoạt
  uploadTime: string; // Dạng chuỗi ISO date
  transactionCount: number;
}

/**
 * Cấu trúc của đối tượng pagination trả về từ API.
 */
export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalDocuments: number;
  limit: number;
}

/**
 * Cấu trúc đầy đủ của response từ API /history.
 */
export interface PaginatedBankLogResponse {
  success: boolean;
  data: BankLog[];
  pagination: PaginationData;
  error?: string; // Thông báo lỗi nếu có
}