// lib/types/statement.types.ts

export interface BankLog {
  _id: string;
  filename: string;
  size: number;
  status: 'thành công' | 'thất bại';
  bank: 'MBBank' | 'BIDV' | string;
  uploadTime: string;
  transactionCount: number;
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalDocuments: number;
  limit: number;
}

export interface PaginatedBankLogResponse {
  success: boolean;
  data: BankLog[];
  pagination: PaginationData;
  error?: string;
}