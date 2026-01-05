export interface Transaction {
  _id: string;
  apartmentId: string;
  feeId: string;
  totalAmount: number;
  payerName: string;
  createdBy?: string;
  date?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CalculateTransactionPayload {
  apartmentId: string;
  feeId: string;
}

export interface CalculateTransactionResponse {
  success: boolean;
  totalAmount: number;
  formula?: string;
  apartmentInfo?: {
    _id: string;
    apartmentNumber: string;
    building: string;
    area: number;
    ownerName?: string;
  };
  feeInfo?: {
    _id: string;
    title: string;
    amount: number;
    unit: string;
  };
  message?: string;
}

export interface CreateTransactionPayload {
  apartmentId: string;
  feeId: string;
  totalAmount: number;
  payerName: string;
  date?: string;
}

export interface TransactionResponse {
  success: boolean;
  data?: Transaction;
  message?: string;
  errors?: Record<string, string[]>;
}

