// src/composables/useAuth.ts
import jwt_decode from 'jwt-decode';

export interface JwtPayload {
  // campos estándar que ya tienes
  sub?: string;         // habitualmente el userId
  email?: string;
  rol?: string;
  firstName?: string;
  lastName?: string;
  clubs?: string[];     // o (string|number)[]
  exp?: number;
  iat?: number;

  // añadir variantes que algunos backends usan
  _id?: string;
  id?: string;
  userId?: string;

  // Si quieres aceptar otros campos sin tipado estricto:
  [key: string]: any;
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
    // Verificar expiración si viene exp
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
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
