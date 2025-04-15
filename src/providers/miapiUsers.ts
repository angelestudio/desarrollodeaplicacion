import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL.replace(/\/$/, '');

export const registerUser = async (userData: any) => {
  try {
    const response = await axios.post(`${API_URL}/usuarios`, userData);
    return response.data;
  } catch (error) {
    console.error('Error registrando usuario:', error);
    throw error;
  }
};

export const loginUser = async (loginData: any) => {
  try {
    const response = await axios.post(`${API_URL}/usuarios/login`, loginData);
    return response.data;
  } catch (error) {
    console.error('Error en el login:', error);
    throw error;
  }
};

export const updatePassword = async (data: { userId: string; password: string }) => {
  try {
    const response = await axios.put(`${API_URL}/usuarios/${data.userId}/password`, {
      password: data.password,
    });
    return response.data;
  } catch (error) {
    console.error('Error actualizando la contraseña:', error);
    throw error;
  }
};