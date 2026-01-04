import { getServerSession } from "next-auth";
import { authOptions } from "./auth"; // Đảm bảo import đúng đường dẫn đến authOptions

export const getServerAuthSession = async () => {
  return await getServerSession(authOptions);
};

export const auth = getServerAuthSession; // Tương thích ngược với tên gọi 'auth'

