import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Asegúrate de que coincide con tu backend

// Obtener todas las notificaciones
export const getNotifications = async () => {
  try {
    const response = await axios.get(`${API_URL}/notifications`);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo notificaciones:', error);
    return [];
  }
};

// Crear una nueva notificación
export const createNotification = async (notificationData) => {
  try {
    const response = await axios.post(`${API_URL}/notifications`, notificationData);
    return response.data;
  } catch (error) {
    console.error('Error creando notificación:', error);
    throw error;
  }
};
