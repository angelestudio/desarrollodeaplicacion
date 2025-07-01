import { defineStore } from 'pinia'
import {
  registerUser,
  loginUser,
  updatePassword,
  joinClubApi,
  leaveClubApi,
} from '@/providers/miapiUsers'
import axios from 'axios'

interface User {
  _id: string
  firstName: string
  lastName: string
  email?: string
  role: string
  clubs: string[]
}

export const useLoginStore = defineStore('login', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null') as User | null,
    token: localStorage.getItem('token') as string | null,
    isAuthenticated: Boolean(localStorage.getItem('token')),
  }),

  actions: {
    setUser(user: User) {
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
        role: res.rol,
        clubs: res.clubs ?? [],
      })
      return res
    },

    async loginUser(creds: any) {
      const res = await loginUser(creds)
      // Guardamos token; el interceptor de apiClient lo inyectará
      localStorage.setItem('token', res.token)
      this.token = res.token

      this.setUser({
        _id: res.sub || res._id,
        firstName: res.firstName,
        lastName: res.lastName,
        email: res.email,
        role: res.rol,
        clubs: res.clubs ?? [],
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
      // Mezclamos respuesta con user, manteniendo clubs
      this.user = { ...this.user, ...res, clubs: this.user.clubs }
      localStorage.setItem('user', JSON.stringify(this.user))
      return res
    },

    async joinClub(clubId: string) {
      if (!this.user) throw new Error('No hay usuario autenticado')
      const { token, clubs } = await joinClubApi(clubId)
      // Actualizamos token
      localStorage.setItem('token', token)
      this.token = token
      // Actualizamos lista de clubs
      this.user.clubs = clubs
      localStorage.setItem('user', JSON.stringify(this.user))
    },

    async leaveClub(clubId: string) {
      if (!this.user) throw new Error('No hay usuario autenticado')
      const { token, clubs } = await leaveClubApi(clubId)
      localStorage.setItem('token', token)
      this.token = token
      this.user.clubs = clubs
      localStorage.setItem('user', JSON.stringify(this.user))
    },
  },
})
