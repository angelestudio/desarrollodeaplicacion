// src/providers/miapi.ts
import axios from 'axios'

// Asume que axios.defaults.baseURL está configurado en main.ts,
// apuntando a e.g. 'https://backend-senaclub-xtrt.onrender.com' o 'https://backend-senaclub-xtrt.onrender.com/api'.

// Posts
export const getPosts = () => {
  return axios.get('/posts')
}

export const createPost = (post: { title: string; content: string; club: string }) => {
  // Enviamos solo title, content, club. Backend extrae userId del token.
  return axios.post('/posts', post)
}

export const updatePost = (id: string, data: Partial<{ title: string; content: string }>) => {
  return axios.patch(`/posts/${id}`, data)
}

export const deletePost = (id: string) => {
  return axios.delete(`/posts/${id}`)
}

// Likes
export const addLike = (postId: string) => {
  return axios.post(`/posts/${postId}/like`)
}

export const removeLike = (postId: string) => {
  return axios.delete(`/posts/${postId}/like`)
}

// Comentarios
export const fetchComments = (postId: string) => {
  return axios.get(`/posts/${postId}/comments`)
}

export const addComment = (postId: string, content: string) => {
  return axios.post(`/posts/${postId}/comments`, { content })
}

export const removeComment = (postId: string, commentId: string) => {
  return axios.delete(`/posts/${postId}/comments/${commentId}`)
}
