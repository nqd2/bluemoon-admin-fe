
export interface Resident {
  _id: string;
  fullName: string;
  dob: string;
  gender: "Nam" | "Nữ" | "Khác";
  identityCard: string;
  hometown?: string;
  job?: string;
  residencyStatus?: "Thường trú" | "Tạm trú" | "Tạm vắng";
  roleInApartment?: string;
  apartmentId?: {
    _id: string;
    apartmentNumber: string;
    building: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateResidentPayload {
  fullName: string;
  dob: string;
  gender: string;
  identityCard: string;
  hometown?: string;
  job?: string;
  apartmentId?: string;
}

export interface UpdateResidentPayload extends Partial<CreateResidentPayload> {
  residencyStatus?: string;
  apartmentId?: string;
}

export interface ResidentListResponse {
  residents: Resident[];
  page: number;
  pages: number;
  total: number;
}

export interface ResidentResponse {
  success: boolean;
  data?: Resident;
  message?: string;
}
