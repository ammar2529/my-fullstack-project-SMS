export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  fullName: string;
  role: string;
  userId: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
