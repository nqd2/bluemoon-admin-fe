export interface DashboardStats {
  residents?: {
    total: number;
    temporary: number;
    permanent: number;
  };
  apartments?: {
    total: number;
    occupied: number;
    vacant: number;
  };
  revenue?: {
    total: number;
    thisMonth: number;
    lastMonth: number;
  };
  transactions?: {
    recent: Array<{
      id: string;
      apartmentId: string;
      apartmentName?: string;
      feeId: string;
      feeTitle?: string;
      totalAmount: number;
      payerName?: string;
      status: string;
      createdAt: string;
    }>;
    total: number;
  };
}

