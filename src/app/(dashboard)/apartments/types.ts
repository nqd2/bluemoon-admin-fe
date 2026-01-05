import { Resident } from "../residents/types";

export interface ApartmentMember extends Resident {
}

export interface Apartment {
  _id: string;
  ownerName?: string;
  ownerId?: string;
  apartmentNumber: string;
  building: string;
  area: number;
  description?: string;
  members: ApartmentMember[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateApartmentPayload {
  ownerId: string;
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
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  message?: string;
}

export interface ApartmentResponse {
  success: boolean;
  data?: Apartment;
  message?: string;
}
