import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Asegúrate de que coincide con tu backend

// Obtener todos los posts
export const getPosts = async () => {
  try {
    const response = await axios.get(`${API_URL}/posts`);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo posts:', error);
    return [];
  }
};

// Crear un nuevo post
export const createPost = async (postData) => {
  try {
    const response = await axios.post(`${API_URL}/posts`, postData);
    return response.data;
  } catch (error) {
    console.error('Error creando post:', error);
    throw error;
  }
};
