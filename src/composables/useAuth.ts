import jwt_decode from 'jwt-decode';

export interface JwtPayload {
  sub: string;
  email: string;
  rol: string;
  firstName: string;
  lastName: string;
  clubs: string[];
  exp: number;
  iat: number;
}

export function getUserFromToken(): JwtPayload | null {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded = jwt_decode<JwtPayload>(token);
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem('token');
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}