import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL.replace(/\/$/, '');

export const registerUser = async (userData: any) => {
  const response = await axios.post(`${API_URL}/usuarios`, userData);
  return response.data;
};

export const loginUser = async (loginData: any) => {
  const response = await axios.post(`${API_URL}/auth/login`, loginData);
  return response.data;
};

export const updatePassword = async (data: { userId: string; password: string }) => {
  const response = await axios.put(
    `${API_URL}/usuarios/${data.userId}/password`,
    { password: data.password }
  );
  return response.data;
};

export const joinClubApi = async (userId: string, club: string) => {
  const response = await axios.patch(
    `${API_URL}/auth/${userId}/clubs`,
    { club }
  );
  return response.data; // { token, clubs }
};

export const leaveClubApi = async (userId: string, club: string) => {
  const response = await axios.delete(
    `${API_URL}/auth/${userId}/clubs/${encodeURIComponent(club)}`
  );
  return response.data; // { token, clubs }
};