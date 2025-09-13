// src/stores/milogin.ts
import { defineStore } from 'pinia'
import {
  registerUser,
  loginUser,
  updatePassword,
  joinClubApi,
  leaveClubApi,
} from '@/providers/miapiUsers'

interface User {
  _id: string
  firstName: string
  lastName: string
  email?: string
  role: string
  clubs: string[]
}

function normalizeClubs(raw: any): string[] {
  if (!Array.isArray(raw)) return []
  return raw.map((c: any) => (typeof c === 'object' && c._id ? String(c._id) : String(c)))
}

export const useLoginStore = defineStore('login', {
  state: () => ({
    user: (JSON.parse(localStorage.getItem('user') || 'null') as User | null),
    token: (localStorage.getItem('token') as string | null),
    isAuthenticated: Boolean(localStorage.getItem('token')),
  }),

  actions: {
    setUser(user: User) {
      // normalizar clubs antes de guardar
      user.clubs = normalizeClubs(user.clubs)
      this.user = user
      this.isAuthenticated = true
      localStorage.setItem('user', JSON.stringify(user))
    },

    async registerUser(data: any) {
      const res = await registerUser(data)
      this.setUser({
        _id: res._id,
        firstName: res.firstName,
        lastName: res.lastName,
        email: res.email,
        role: res.rol ?? res.role ?? 'user',
        clubs: normalizeClubs(res.clubs ?? []),
      })
      return res
    },

    async loginUser(creds: any) {
      const res = await loginUser(creds)
      // Guardamos token si viene
      if (res.token) {
        localStorage.setItem('token', res.token)
        this.token = res.token
        this.isAuthenticated = true
      }

      this.setUser({
        _id: res.sub || res._id,
        firstName: res.firstName,
        lastName: res.lastName,
        email: res.email,
        role: res.rol ?? res.role ?? 'user',
        clubs: normalizeClubs(res.clubs ?? []),
      })
      return res
    },

    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    },

    async updatePassword(newPassword: string) {
      if (!this.user) throw new Error('No hay usuario autenticado')
      const res = await updatePassword({ userId: this.user._id, password: newPassword })
      // mezclar respuesta con user (no sobrescribimos clubs si res no trae)
      this.user = {
        ...this.user,
        ...(res || {}),
        clubs: this.user.clubs ?? [],
      }
      localStorage.setItem('user', JSON.stringify(this.user))
      return res
    },

    async joinClub(clubId: string) {
      if (!this.user) throw new Error('No hay usuario autenticado')
      try {
        const res = await joinClubApi(clubId)
        // si backend devuelve token, lo actualizamos
        if (res.token) {
          localStorage.setItem('token', res.token)
          this.token = res.token
          this.isAuthenticated = true
        }
        if (Array.isArray(res.clubs)) {
          this.user!.clubs = normalizeClubs(res.clubs)
        } else {
          // fallback: añadir localmente si no existe
          const normalized = normalizeClubs(this.user!.clubs)
          if (!normalized.includes(clubId)) {
            this.user!.clubs = [...normalized, clubId]
          } else {
            this.user!.clubs = normalized
          }
        }
        localStorage.setItem('user', JSON.stringify(this.user))
      } catch (err) {
        console.error('store.joinClub error:', err)
        throw err
      }
    },

    async leaveClub(clubId: string) {
      if (!this.user) throw new Error('No hay usuario autenticado')
      try {
        const res = await leaveClubApi(clubId)
        if (res.token) {
          localStorage.setItem('token', res.token)
          this.token = res.token
          this.isAuthenticated = true
        }
        if (Array.isArray(res.clubs)) {
          this.user!.clubs = normalizeClubs(res.clubs)
        } else {
          // fallback: eliminar localmente
          const normalized = normalizeClubs(this.user!.clubs)
          this.user!.clubs = normalized.filter(id => id !== clubId)
        }
        localStorage.setItem('user', JSON.stringify(this.user))
      } catch (err) {
        console.error('store.leaveClub error:', err)
        throw err
      }
    },
  },
})
