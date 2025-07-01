import axios from 'axios'
import jwt_decode from 'jwt-decode'

const API_URL = import.meta.env.VITE_API_URL.replace(/\/$/, '')

// Creamos un cliente dedicado para todas las llamadas
export const apiClient = axios.create({
  baseURL: API_URL,
})

// Interceptor que inyecta siempre el token en minúsculas
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers ?? {}
    config.headers['authorization'] = `Bearer ${token}`
  }
  return config
})

interface JwtPayload {
  sub: string
  iat: number
  exp: number
}

// Helper para extraer el userId del JWT
function getUserIdFromToken(): string {
  const token = localStorage.getItem('token')
  if (!token) throw new Error('No hay token en localStorage')
  const { sub } = jwt_decode<JwtPayload>(token)
  return sub
}

// 1) Registro de usuario
export async function registerUser(userData: any) {
  const res = await apiClient.post('/usuarios', userData)
  return res.data
}

// 2) Login
export async function loginUser(loginData: any) {
  const res = await apiClient.post('/auth/login', loginData)
  return res.data
}

// 3) Actualizar contraseña
export async function updatePassword(params: { userId: string; password: string }) {
  const res = await apiClient.put(`/usuarios/${params.userId}/password`, {
    password: params.password,
  })
  return res.data
}

// 4) Unirse a un club
export async function joinClubApi(clubId: string) {
  const userId = getUserIdFromToken()
  const res = await apiClient.patch(
    `/auth/${userId}/clubs`,
    { club: clubId } // el backend espera “club” en el body
  )
  return res.data as { token: string; clubs: string[] }
}

// 5) Salir de un club
export async function leaveClubApi(clubId: string) {
  const userId = getUserIdFromToken()
  const res = await apiClient.delete(
    `/auth/${userId}/clubs`,
    { data: { club: clubId } } // DELETE con body { club }
  )
  return res.data as { token: string; clubs: string[] }
}
