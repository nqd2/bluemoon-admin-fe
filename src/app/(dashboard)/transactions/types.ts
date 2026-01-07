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
  success?: boolean;
  totalAmount: number;
  unitPrice?: number;
  quantity?: number;
  apartment?: string;
  fee?: string;
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
  year?: number;
  month?: number;
}

export interface TransactionSummary {
  apartmentId: string;
  name: string;
  building: string;
  area?: number;
  ownerName?: string | null;
  totalCollected: number;
  transactionCount: number;
}

export interface ApartmentTransactionRecord {
  _id: string;
  apartmentId: {
    _id: string;
    name: string;
    building: string;
  };
  feeId: {
    _id: string;
    title: string;
    type: string;
    unit: string;
  };
  totalAmount: number;
  payerName?: string;
  createdBy?: string;
  date?: string;
  month?: number;
  year?: number;
  usage?: number;
  unitPrice?: number;
  status?: string;
  createdAt?: string;
}

export interface TransactionResponse {
  success: boolean;
  data?: Transaction;
  message?: string;
  errors?: Record<string, string[]>;
}

