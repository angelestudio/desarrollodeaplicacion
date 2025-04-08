import { defineStore } from 'pinia';
import axios from 'axios';
const API_BASE_URL = 'http://localhost:3000';

export const useClubsStore = defineStore('clubs', {
  state: () => ({
    clubs: [] as Array<{ _id: string; name: string; description: string }>
  }),
  actions: {
    async fetchClubs() {
      try {
        const response = await axios.get(`${API_BASE_URL}/clubs`);
        this.clubs = response.data;
      } catch (error) {
        console.error('Error al obtener clubs:', error);
      }
    },
    async createClub(club: { name: string; description: string }) {
      try {
        const response = await axios.post(`${API_BASE_URL}/clubs`, club);
        this.clubs.push(response.data);
      } catch (error) {
        console.error('Error al crear club:', error);
      }
    },
    async deleteClub(id: string) {
      try {
        await axios.delete(`${API_BASE_URL}/clubs/${id}`);
        this.clubs = this.clubs.filter(club => club._id !== id);
      } catch (error) {
        console.error('Error al eliminar club:', error);
      }
    }
  }
});