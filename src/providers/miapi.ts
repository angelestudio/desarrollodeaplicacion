import axios from 'axios';
const API_BASE_URL = 'http://localhost:3000';

export const getPosts = () => {
  return axios.get(`${API_BASE_URL}/posts`);
};

export const createPost = (post: { title: string; content: string; club: string; user: string }) => {
  return axios.post(`${API_BASE_URL}/posts`, post)
}

export const updatePost = (id: string, data: Partial<{ title: string; content: string }>) => {
  return axios.patch(`${API_BASE_URL}/posts/${id}`, data);
};

export const deletePost = (id: string) => {
  return axios.delete(`${API_BASE_URL}/posts/${id}`);
};

export const getPostsByUser = (userId: string) => {
  return axios.get(`${API_BASE_URL}/posts/user/${userId}`);
};