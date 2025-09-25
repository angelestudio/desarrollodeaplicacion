import axios from 'axios'

const API_URL = 'https://backend-senaclub-xtrt.onrender.com' // Asegúrate de que coincide con tu backend

export const getNews = async () => {
  try {
    const response = await axios.get(`${API_URL}/news`)
    return response.data
  } catch (error) {
    console.error('Error obteniendo noticias:', error)
    return []
  }
}

export const createNews = async (newsData) => {
  try {
    const response = await axios.post(`${API_URL}/news`, newsData)
    return response.data
  } catch (error) {
    console.error('Error creando noticia:', error)
    throw error
  }
}
