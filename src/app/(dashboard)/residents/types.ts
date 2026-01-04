// Resident type định nghĩa cấu trúc dữ liệu Nhân khẩu
export interface Resident {
  _id: string;
  fullName: string;
  dob: string; // ISO date string
  gender: "Nam" | "Nữ" | "Khác";
  identityCard: string;
  hometown?: string;
  job?: string;
  status?: "Thường trú" | "Tạm trú" | "Tạm vắng";
  roleInApartment?: string;
  apartmentId?: {
    _id: string;
    apartmentNumber: string;
    building: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

// Request payload cho việc tạo mới resident
export interface CreateResidentPayload {
  fullName: string;
  dob: string;
  gender: string;
  identityCard: string;
  hometown?: string;
  job?: string;
}

// Request payload cho việc cập nhật resident
export interface UpdateResidentPayload extends Partial<CreateResidentPayload> {
  status?: string;
}

// Response từ API list residents
export interface ResidentListResponse {
  residents: Resident[];
  page: number;
  pages: number;
  total: number;
}

// Response từ API single resident
export interface ResidentResponse {
  success: boolean;
  data?: Resident;
  message?: string;
}
