import { defineStore } from 'pinia'
import { registerUser, loginUser, updatePassword } from '@/providers/miapiUsers'

interface User {
  _id:       string       // ahora obligatorio
  firstName: string
  lastName:  string
  email?:    string
  role:      string       // lo hacemos obligatorio si tu JWT siempre lo trae
  clubs:     string[]     // ya NO es opcional
}

export const useLoginStore = defineStore('login', {
  state: () => {
    // parseo seguro y normalización de 'clubs'
    const stored = JSON.parse(localStorage.getItem('user') || 'null')
    return {
      user: stored
        ? ({ ...stored, clubs: stored.clubs ?? [] } as User)
        : null,
      token: localStorage.getItem('token') || null,
      isAuthenticated: !!localStorage.getItem('token'),
    }
  },

  actions: {
    // Inicializa el usuario y persiste en LS
    setUser(newUser: User) {
      this.user = newUser
      this.isAuthenticated = true
      localStorage.setItem('user', JSON.stringify(newUser))
    },

    // Registra y usa setUser
    async registerUser(newUserData: any) {
      const data = await registerUser(newUserData)
      this.setUser({
        _id:       data._id,
        firstName: data.firstName,
        lastName:  data.lastName,
        email:     data.email,
        role:      data.role,
        clubs:     data.clubs ?? []
      })
      return data
    },

    // Loguea y usa setUser
    async loginUser(credentials: any) {
      const data = await loginUser(credentials)
      this.setUser({
        _id:       data._id,
        firstName: data.firstName,
        lastName:  data.lastName,
        email:     data.email,
        role:      data.role,
        clubs:     data.clubs ?? []
      })
      return data
    },

    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    },

    async updatePassword(newPassword: string) {
      if (!this.user?._id) {
        throw new Error('No hay usuario autenticado o falta el ID')
      }
      const updated = await updatePassword({
        userId: this.user._id,
        password: newPassword,
      })
      // fusiona cambios (mantiene clubs, etc.)
      this.user = { ...this.user, ...updated, clubs: this.user.clubs }
      localStorage.setItem('user', JSON.stringify(this.user))
      return updated
    },

    joinClub(clubName: string) {
      if (!this.user) throw new Error('No hay usuario autenticado')
      // clubs siempre existe gracias al estado inicial y setUser
      if (!this.user.clubs.includes(clubName)) {
        this.user.clubs.push(clubName)
        localStorage.setItem('user', JSON.stringify(this.user))
      }
    },

    leaveClub(clubName: string) {
      if (!this.user) throw new Error('No hay usuario autenticado')
      this.user.clubs = this.user.clubs.filter(c => c !== clubName)
      localStorage.setItem('user', JSON.stringify(this.user))
    },
  },
})