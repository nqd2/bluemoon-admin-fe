import { Resident } from "../residents/types";

export interface ApartmentMember {
  resident: Resident | string; // Có thể là object populated hoặc ID string
  role: "Chủ hộ" | "Thành viên";
  _id?: string;
}

export interface Apartment {
  _id: string;
  name: string;
  apartmentNumber: string;
  building: string;
  area: number;
  description?: string;
  members: ApartmentMember[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateApartmentPayload {
  name: string;
  apartmentNumber: string;
  building: string;
  area: number;
  description?: string;
}

export interface AddMemberPayload {
  residentId: string;
  role: "Chủ hộ" | "Thành viên";
}

export interface ApartmentListResponse {
  success: boolean;
  data: Apartment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

export interface ApartmentResponse {
  success: boolean;
  data?: Apartment;
  message?: string;
}
