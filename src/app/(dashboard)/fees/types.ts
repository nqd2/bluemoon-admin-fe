export type FeeType = "Service" | "Contribution";

export interface Fee {
  _id: string;
  title: string;
  description?: string;
  type: FeeType;
  amount: number;
  unit: string; // "m2", "person", "household"
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateFeePayload {
  title: string;
  description?: string;
  type: FeeType;
  amount: number;
  unit: string;
  isActive?: boolean;
}

export interface FeeListResponse {
  success: boolean;
  data: Fee[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

export interface FeeResponse {
  success: boolean;
  data?: Fee;
  message?: string;
}

export type PaymentStatus = "PAID" | "UNPAID";

export interface ApartmentStatus {
  apartmentId: string;
  apartmentName: string;
  ownerName: string;
  status: PaymentStatus;
  paidAmount?: number;
  paidDate?: string;
  transactionId?: string;
}

export interface FeeStatusResponse {
  success: boolean;
  data: {
    feeInfo: Fee;
    apartments: ApartmentStatus[];
  };
  message?: string;
}

