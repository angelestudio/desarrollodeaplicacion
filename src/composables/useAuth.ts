// src/composables/useAuth.ts
import jwt_decode from 'jwt-decode';

export interface JwtPayload {
  sub: string;         // userId
  email: string;
  rol: string;
  firstName: string;
  lastName: string;
  clubs: string[];
  exp: number;
  iat: number;
}

/**
 * Extrae y valida el payload del token JWT guardado en localStorage.
 * Retorna JwtPayload o null si no existe o está expirado/inválido.
 */
export function getUserFromToken(): JwtPayload | null {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded = jwt_decode<JwtPayload>(token);
    // Verificar expiración
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem('token');
      return null;
    }
    return decoded;
  } catch (err) {
    console.error('Error decodificando token:', err);
    localStorage.removeItem('token');
    return null;
  }
}
