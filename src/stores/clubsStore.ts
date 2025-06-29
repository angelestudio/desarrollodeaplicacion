import { defineStore } from 'pinia'
import axios from 'axios'

// Interfaz para clubes
interface Club {
  _id: string
  name: string
  description: string
}

// URL base
const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

export const useClubsStore = defineStore('clubs', {
  state: () => ({
    clubs: [] as Club[]
  }),

  actions: {
    async fetchClubs() {
      try {
        const response = await axios.get(`${API_BASE_URL}/clubs`)
        this.clubs = response.data
      } catch (error) {
        console.error('❌ Error al obtener clubs:', error)
        this.clubs = [] // ← Opcional: en caso de error, vacía para evitar residuos
      }
    },

    async createClub(club: { name: string; description: string }) {
      try {
        const response = await axios.post(`${API_BASE_URL}/clubs`, club)
        const newClub: Club = response.data
        this.clubs.push(newClub)
        return newClub
      } catch (error: any) {
        const status = error.response?.status
        const data = error.response?.data
        console.error(`❌ Error creando club (status: ${status}):`, data)
        throw error
      }
    },

    async deleteClub(id: string) {
      try {
        await axios.delete(`${API_BASE_URL}/clubs/${id}`)
        this.clubs = this.clubs.filter(c => c._id !== id)
      } catch (error) {
        console.error('❌ Error al eliminar club:', error)
        throw error
      }
    },

    async refreshClubs() {
      await this.fetchClubs()
    }
  }
})
