// src/providers/miapiUsers.ts
import axios from 'axios'
import jwt_decode from 'jwt-decode'

const API_URL =
  (import.meta.env.VITE_API_URL && String(import.meta.env.VITE_API_URL).replace(/\/$/, '')) ||
  'http://localhost:3000'

export const apiClient = axios.create({
  baseURL: API_URL,
})

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers ?? {}
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

// Tipado mínimo para el JWT
interface JwtPayload {
  sub: string
  iat: number
  exp: number
}

// Nuevo: intenta token primero, si no existe usa localStorage.user
function getUserIdFromToken(): string {
  const token = localStorage.getItem('token')
  if (token) {
    try {
      const { sub } = jwt_decode<JwtPayload>(token)
      if (!sub) throw new Error('Token sin sub')
      return sub
    } catch (err) {
      console.warn('Token inválido o no se pudo decodificar:', (err as Error).message)
    }
  }

  // fallback a localStorage.user
  const stored = localStorage.getItem('user')
  if (stored) {
    try {
      const u = JSON.parse(stored)
      if (u && u._id) return u._id
    } catch (e) {
      console.warn('No se pudo parsear localStorage.user:', (e as Error).message)
    }
  }

  throw new Error('No hay userId disponible (token y localStorage fallaron)')
}

// 1) Registro de usuario
export async function registerUser(userData: any) {
  try {
    const res = await apiClient.post('/usuarios', userData)
    return res.data
  } catch (err: any) {
    console.error('registerUser error:', err.response?.data ?? err.message)
    throw err
  }
}

// 2) Login
export async function loginUser(loginData: any) {
  try {
    const res = await apiClient.post('/auth/login', loginData)
    return res.data
  } catch (err: any) {
    console.error('loginUser error:', err.response?.data ?? err.message)
    throw err
  }
}

// 3) Actualizar contraseña
export async function updatePassword(params: { userId: string; password: string }) {
  try {
    const res = await apiClient.put(`/usuarios/${params.userId}/password`, {
      password: params.password,
    })
    return res.data
  } catch (err: any) {
    console.error('updatePassword error:', err.response?.data ?? err.message)
    throw err
  }
}

// Helper: obtener perfil (fallback para sincronizar user)
export async function fetchProfile() {
  const userId = getUserIdFromToken()
  try {
    const res = await apiClient.get(`/usuarios/${userId}`)
    return res.data
  } catch (err: any) {
    console.error('fetchProfile error:', err.response?.data ?? err.message)
    throw err
  }
}

// 4) Unirse a un club (usa endpoint /auth que firma token nuevo)
export async function joinClubApi(clubId: string) {
  const userId = getUserIdFromToken()
  try {
    // En tu backend auth tienes: PATCH /auth/:userId/clubs { club }
    const res = await apiClient.patch(`/auth/${userId}/clubs`, { club: clubId })
    return res.data as { token?: string; clubs?: string[] }
  } catch (err: any) {
    console.error('joinClubApi error status:', err.response?.status)
    console.error('joinClubApi response data:', err.response?.data)
    throw err
  }
}

// 5) Salir de un club (usa endpoint /auth que firma token nuevo)
export async function leaveClubApi(clubId: string) {
  const userId = getUserIdFromToken()
  try {
    // En tu backend auth tienes: DELETE /auth/:userId/clubs/:club
    const res = await apiClient.delete(`/auth/${userId}/clubs/${encodeURIComponent(clubId)}`)
    return res.data as { token?: string; clubs?: string[] }
  } catch (err: any) {
    console.error('leaveClubApi error status:', err.response?.status)
    console.error('leaveClubApi response data:', err.response?.data)
    throw err
  }
}
