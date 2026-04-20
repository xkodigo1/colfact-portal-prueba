/**
 * ═════════════════════════════════════════════════════════════════════════
 * TIPOS DE AUTENTICACION
 *
 * DECISION: ¿Por qué UserRole es un type union en lugar de enum?
 * → Union types ('Admin' | 'Issuer' | 'IssuerViewer') se transpilan mejor
 *   que enums (enums generan codigo extra en JavaScript).
 * → Es mas simple: no necesita importar el enum, solo el type.
 * → Funciona mejor con Zod para validacion de schema.
 * → El compilador de TypeScript igual hace type-checking exhaustivo.
 *
 * DECISION: ¿Por qué loginResponse tiene refreshToken si no se usa?
 * → El contrato de la API lo incluye (Portal.BFF lo retorna).
 * → En futuro se podria implementar refresh token flow.
 * → Es mejor estar preparado que cambiar los tipos despues.
 *
 * DECISION: ¿Por qué AuthUser tiene algunos campos opcionales?
 * → id, fullName, role son requeridos (vienen del JWT siempre).
 * → userName es opcional porque el JWT podria no incluirlo en el payload.
 * → Esto da flexibilidad sin perder type safety.
 *
 * DECISION: ¿Por qué JwtPayload tiene todos los campos opcionales?
 * → El JWT podria estar mal formado o faltarle claims.
 * → buildAuthUserFromToken() valida antes de usarlos.
 * → Los ? evitan crashes si el JWT es invalido.
 * ═════════════════════════════════════════════════════════════════════════
 */

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
