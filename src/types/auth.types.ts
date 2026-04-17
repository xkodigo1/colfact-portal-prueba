export type UserRole = 'Admin' | 'Issuer' | 'IssuerViewer';

export interface LoginRequest {
  userName: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  role: UserRole;
  fullName: string;
}

export interface AuthUser {
  id: number;
  fullName: string;
  role: UserRole;
  userName?: string;
}

export interface JwtPayload {
  sub?: string;
  role?: UserRole;
  fullName?: string;
  userName?: string;
  exp?: number;
}

export interface ApiError {
  message: string;
  code?: string;
}

export interface AuthContextValue {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
}
