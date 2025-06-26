// src/stores/loginStore.ts
import { defineStore } from 'pinia';
import {
  registerUser,
  loginUser as apiLoginUser,
  updatePassword,
  joinClubApi,
  leaveClubApi,
} from '@/providers/miapiUsers';
import axios from 'axios';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  rol: string;      // coincide con 'rol' de tu payload
  clubs: string[];
}

export const useLoginStore = defineStore('login', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null') as User | null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
  }),
  actions: {
    setUser(newUser: User) {
      this.user = newUser;
      this.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(newUser));
    },

    async registerUser(data: any) {
      // data: { firstName, lastName, email, password, ... }
      const res = await registerUser(data);
      // Supongamos que res retorna { _id, firstName, lastName, email, rol, clubs }
      const newUser: User = {
        _id: res._id,
        firstName: res.firstName,
        lastName: res.lastName,
        email: res.email,
        rol: res.rol,
        clubs: res.clubs ?? [],
      };
      this.setUser(newUser);
      return res;
    },

    async loginUser(creds: any) {
      // creds: { email, password }
      const res = await apiLoginUser(creds);
      // Supongamos que res retorna { token, sub, firstName, lastName, email, rol, clubs }
      const token = res.token;
      // Configurar axios
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Extraer datos de usuario:
      // Si el endpoint devuelve directamente los campos de usuario:
      const userId = res.sub || res._id;
      const newUser: User = {
        _id: userId,
        firstName: res.firstName,
        lastName: res.lastName,
        email: res.email,
        rol: res.rol,
        clubs: res.clubs ?? [],
      };
      this.setUser(newUser);
      this.token = token;
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
      // Dependiendo de lo que devuelva tu API, actualiza user si hace falta.
      // Por ejemplo, si solo confirma el cambio, no hay que actualizar user local.
      return res;
    },

    async joinClub(clubName: string) {
      if (!this.user) throw new Error('No hay usuario autenticado');
      const { token, clubs } = await joinClubApi(this.user._id, clubName);
      // Actualizar token y axios
      localStorage.setItem('token', token);
      this.token = token;
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Actualizar clubs en user
      if (this.user) {
        this.user.clubs = clubs;
        localStorage.setItem('user', JSON.stringify(this.user));
      }
    },

    async leaveClub(clubName: string) {
      if (!this.user) throw new Error('No hay usuario autenticado');
      const { token, clubs } = await leaveClubApi(this.user._id, clubName);
      localStorage.setItem('token', token);
      this.token = token;
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      if (this.user) {
        this.user.clubs = clubs;
        localStorage.setItem('user', JSON.stringify(this.user));
      }
    },
  },
});
