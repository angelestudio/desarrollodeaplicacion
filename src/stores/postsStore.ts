// src/stores/postsStore.ts
import { defineStore } from 'pinia';
import {
  getPosts,
  createPost,
  deletePost,
  addLike as apiAddLike,
  removeLike as apiRemoveLike,
  fetchComments as apiFetchComments,
  addComment as apiAddComment,
  removeComment as apiRemoveComment,
} from '@/providers/miapi';
import { getUserFromToken } from '@/composables/useAuth';
import axios from 'axios';

export interface PostItem {
  _id: string;
  title: string;
  content: string;
  club: string;
  user: string;      // userId del autor
  likesCount: number;
  likedBy?: string[]; 
}

export interface CommentItem {
  _id: string;
  content: string;
  userId: string;
  username: string;
  createdAt?: string;
}

export const usePostsStore = defineStore('posts', {
  state: () => ({
    posts: [] as PostItem[],
    likedByUser: [] as string[], // IDs de posts que el usuario actual ha dado like
  }),
  actions: {
    async fetchPosts() {
      try {
        console.log('📡 fetchPosts -> GET', axios.defaults.baseURL + '/posts');
        const response = await getPosts();
        console.log('✅ fetchPosts status:', response.status);
        const data: PostItem[] = response.data;
        this.posts = data.map(p => ({
          _id: p._id,
          title: p.title,
          content: p.content,
          club: p.club,
          user: p.user,
          likesCount: p.likesCount ?? 0,
          likedBy: p.likedBy ?? [],
        }));
        // Calcular likedByUser
        const payload = getUserFromToken();
        const userId = payload?.sub;  // usamos sub como ID
        if (userId) {
          this.likedByUser = this.posts
            .filter(p => p.likedBy?.includes(userId))
            .map(p => p._id);
        } else {
          this.likedByUser = [];
        }
      } catch (error: any) {
        console.error('Error al obtener posts:', error);
        if (error.response) {
          console.error('Status:', error.response.status, 'Data:', error.response.data);
        }
      }
    },

    async addPost(post: { title: string; content: string; club: string }) {
      try {
        const response = await createPost(post);
        console.log('Post creado, status:', response.status);
        await this.fetchPosts();
      } catch (error: any) {
        console.error('Error al crear post:', error);
        if (error.response) {
          console.error('Status:', error.response.status, 'Data:', error.response.data);
        }
      }
    },

    async removePost(id: string) {
      try {
        const response = await deletePost(id);
        console.log('Post eliminado, status:', response.status);
        this.posts = this.posts.filter(p => p._id !== id);
        this.likedByUser = this.likedByUser.filter(pid => pid !== id);
      } catch (error: any) {
        console.error('Error al eliminar post:', error);
        if (error.response) {
          console.error('Status:', error.response.status, 'Data:', error.response.data);
        }
      }
    },

    // Likes
    async addLike(postId: string) {
      try {
        const resp = await apiAddLike(postId);
        console.log('Like añadido, status:', resp.status);
        const idx = this.posts.findIndex(p => p._id === postId);
        if (idx !== -1) {
          this.posts[idx].likesCount = resp.data.likesCount;
          const payload = getUserFromToken();
          const userId = payload?.sub;
          if (userId && !this.likedByUser.includes(postId)) {
            this.likedByUser.push(postId);
          }
        }
      } catch (error: any) {
        console.error('Error al dar like:', error);
        if (error.response) {
          console.error('Status:', error.response.status, 'Data:', error.response.data);
        }
      }
    },
    async removeLike(postId: string) {
      try {
        const resp = await apiRemoveLike(postId);
        console.log('Like removido, status:', resp.status);
        const idx = this.posts.findIndex(p => p._id === postId);
        if (idx !== -1) {
          this.posts[idx].likesCount = resp.data.likesCount;
          this.likedByUser = this.likedByUser.filter(pid => pid !== postId);
        }
      } catch (error: any) {
        console.error('Error al quitar like:', error);
        if (error.response) {
          console.error('Status:', error.response.status, 'Data:', error.response.data);
        }
      }
    },

    // Comentarios
    async fetchComments(postId: string): Promise<CommentItem[]> {
      try {
        const resp = await apiFetchComments(postId);
        console.log('Comentarios obtenidos, status:', resp.status);
        return resp.data as CommentItem[];
      } catch (error: any) {
        console.error('Error al obtener comentarios:', error);
        if (error.response) {
          console.error('Status:', error.response.status, 'Data:', error.response.data);
        }
        return [];
      }
    },

    async addComment(postId: string, content: string) {
      try {
        const resp = await apiAddComment(postId, content);
        console.log('Comentario añadido, status:', resp.status);
      } catch (error: any) {
        console.error('Error al agregar comentario:', error);
        if (error.response) {
          console.error('Status:', error.response.status, 'Data:', error.response.data);
        }
      }
    },

    async removeComment(postId: string, commentId: string) {
      try {
        const resp = await apiRemoveComment(postId, commentId);
        console.log('Comentario eliminado, status:', resp.status);
      } catch (error: any) {
        console.error('Error al eliminar comentario:', error);
        if (error.response) {
          console.error('Status:', error.response.status, 'Data:', error.response.data);
        }
        throw error;
      }
    },
  },
});
