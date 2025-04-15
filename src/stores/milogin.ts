import { defineStore } from 'pinia';
import { registerUser, loginUser, updatePassword } from '@/providers/miapiUsers';

export const useLoginStore = defineStore('login', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null') as any,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
  }),

  actions: {
    async registerUser(newUser: any) {
      const data = await registerUser(newUser);
      this.user = data;
      this.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(data));
      return data;
    },

    async loginUser(credentials: any) {
      const data = await loginUser(credentials);
      this.user = data;
      this.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(data));
      return data;
    },

    logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },

    async updatePassword(newPassword: string) {
      if (!this.user || !this.user._id) {
        throw new Error('No hay usuario autenticado o falta el ID');
      }
      const updatedUser = await updatePassword({
        userId: this.user._id,
        password: newPassword,
      });
      
      this.user = { ...this.user, ...updatedUser };
      localStorage.setItem('user', JSON.stringify(this.user));
      return updatedUser;
    },

    
    joinClub(clubName: string) {
      if (!this.user) {
        throw new Error('No hay usuario autenticado');
      }
      if (!this.user.clubs) {
       
        this.user.clubs = [];
      }
      if (!this.user.clubs.includes(clubName)) {
        this.user.clubs.push(clubName);
        localStorage.setItem('user', JSON.stringify(this.user));
      }
    }
  }
});