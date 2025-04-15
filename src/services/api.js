import axios from 'axios';

const API_URL = 'http://localhost:3000'; 


const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});


export default api;


export const getNews = async () => {
  try {
    const response = await api.get('/news');
    return response.data;
  } catch (error) {
    console.error('Error obteniendo noticias:', error);
    return [];
  }
};

export const createNews = async (newsData) => {
  try {
    const response = await api.post('/news', newsData);
    return response.data;
  } catch (error) {
    console.error('Error creando noticia:', error);
    throw error;
  }
};
