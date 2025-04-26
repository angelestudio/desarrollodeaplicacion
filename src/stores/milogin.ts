import { defineStore } from 'pinia';
import {
  registerUser,
  loginUser,
  updatePassword,
  joinClubApi,
  leaveClubApi
} from '@/providers/miapiUsers';
import axios from 'axios';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  role: string;
  clubs: string[];
}

export const useLoginStore = defineStore('login', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null') as User | null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token')
  }),
  actions: {
    setUser(newUser: User) {
      this.user = newUser;
      this.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(newUser));
    },
    async registerUser(data: any) {
      const res = await registerUser(data);
      this.setUser({
        _id: res._id,
        firstName: res.firstName,
        lastName: res.lastName,
        email: res.email,
        role: res.rol,
        clubs: res.clubs ?? []
      });
      return res;
    },
    async loginUser(creds: any) {
      const res = await loginUser(creds);
      this.setUser({
        _id: res.sub || res._id,
        firstName: res.firstName,
        lastName: res.lastName,
        email: res.email,
        role: res.rol,
        clubs: res.clubs ?? []
      });
      localStorage.setItem('token', res.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.token}`;
      return res;
    },
    logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    },
    async updatePassword(newPassword: string) {
      if (!this.user) throw new Error('No hay usuario autenticado');
      const res = await updatePassword({ userId: this.user._id, password: newPassword });
      this.user = { ...this.user, ...res, clubs: this.user.clubs };
      localStorage.setItem('user', JSON.stringify(this.user));
      return res;
    },
    async joinClub(clubName: string) {
      if (!this.user) throw new Error('No hay usuario autenticado');
      const { token, clubs } = await joinClubApi(this.user._id, clubName);
      // Actualizar token
      localStorage.setItem('token', token);
      this.token = token;
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Actualizar clubs
      this.user!.clubs = clubs;
      localStorage.setItem('user', JSON.stringify(this.user));
    },
    async leaveClub(clubName: string) {
      if (!this.user) throw new Error('No hay usuario autenticado');
      const { token, clubs } = await leaveClubApi(this.user._id, clubName);
      // Actualizar token
      localStorage.setItem('token', token);
      this.token = token;
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Actualizar clubs
      this.user!.clubs = clubs;
      localStorage.setItem('user', JSON.stringify(this.user));
    }
  }
});