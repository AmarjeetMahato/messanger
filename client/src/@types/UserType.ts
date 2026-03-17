export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatarUrl: string | null;   // sometimes avatar might be null
  isVerified: boolean;
  lastSeen: string | null;    // ISO string or null if never seen
}

export interface UserResponse{
   message: string;
  success: boolean;
  data: User;
}


export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UsersData {
  data: User[]; // array of users
  pagination: Pagination;
}

export interface UsersResponse {
  message: string;
  success: boolean;
  data: UsersData; // object containing the array and pagination
}