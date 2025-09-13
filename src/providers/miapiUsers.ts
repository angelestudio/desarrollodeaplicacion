// src/providers/miapiUsers.ts
import axios from 'axios'
import jwt_decode from 'jwt-decode'

const API_URL =
  (import.meta.env.VITE_API_URL && String(import.meta.env.VITE_API_URL).replace(/\/$/, '')) ||
  'http://localhost:3000'

// Cliente Axios compartido
export const apiClient = axios.create({
  baseURL: API_URL,
})

// Interceptor: inyecta token con header "Authorization"
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

// Extrae el userId del token (lanza si no hay token)
function getUserIdFromToken(): string {
  const token = localStorage.getItem('token')
  if (!token) throw new Error('No hay token en localStorage')
  try {
    const { sub } = jwt_decode<JwtPayload>(token)
    if (!sub) throw new Error('Token sin sub')
    return sub
  } catch (err) {
    throw new Error('Token inválido')
  }
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


// 4) Unirse a un club
export async function joinClubApi(clubId: string) {
  const userId = getUserIdFromToken()
  try {
    const res = await apiClient.patch(`/usuarios/${userId}/clubs/${clubId}`)
    return res.data as { token?: string; clubs?: string[] }
  } catch (err: any) {
    console.error('joinClubApi error status:', err.response?.status)
    console.error('joinClubApi response data:', err.response?.data)
    throw err
  }
}

// 5) Salir de un club
export async function leaveClubApi(clubId: string) {
  const userId = getUserIdFromToken()
  try {
    const res = await apiClient.delete(`/usuarios/${userId}/clubs/${clubId}`)
    return res.data as { token?: string; clubs?: string[] }
  } catch (err: any) {
    console.error('leaveClubApi error status:', err.response?.status)
    console.error('leaveClubApi response data:', err.response?.data)
    throw err
  }
}
