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

export interface UserInfo {
  _id: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface PostItem {
  _id: string;
  title: string;
  content: string;
  club: string;
  // puede venir como id (string) o como objeto poblado (UserInfo)
  user: string | UserInfo;
  // nombre para mostrar (opcional; extraído de p.username o p.user.*)
  username?: string;
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
    comments: {} as Record<string, CommentItem[]>, // postId -> lista de comentarios
  }),

  actions: {
    // Traer posts y normalizar username
    async fetchPosts() {
      try {
        console.log('📡 fetchPosts -> GET', axios.defaults.baseURL + '/posts');
        const response = await getPosts();
        console.log('✅ fetchPosts status:', response.status);

        const raw = Array.isArray(response.data) ? response.data : [];
        this.posts = raw.map((p: any) => {
          const userField = p.user;
          // Obtener username preferentemente de p.username (top-level),
          // luego de userField.username, luego de firstName+lastName.
          let username: string | undefined;
          if (p.username && typeof p.username === 'string' && p.username.trim()) {
            username = p.username.trim();
          } else if (userField && typeof userField === 'object') {
            if (userField.username && typeof userField.username === 'string' && userField.username.trim()) {
              username = userField.username.trim();
            } else {
              const fn = (userField.firstName || userField.first_name || '').trim();
              const ln = (userField.lastName || userField.last_name || '').trim();
              const fullname = `${fn} ${ln}`.trim();
              if (fullname) username = fullname;
            }
          }

          return {
            _id: p._id,
            title: p.title,
            content: p.content,
            club: p.club,
            user: userField ?? (p.userId ?? ''),
            username,
            likesCount: typeof p.likesCount === 'number' ? p.likesCount : 0,
            likedBy: Array.isArray(p.likedBy) ? p.likedBy : [],
          } as PostItem;
        });

        // Calcular likedByUser según token (sub)
        const payload = getUserFromToken();
        const userId = payload?.sub;
        if (userId) {
          this.likedByUser = this.posts.filter((p) => p.likedBy?.includes(userId)).map((p) => p._id);
        } else {
          this.likedByUser = [];
        }
      } catch (error: any) {
        console.error('❌ Error al obtener posts:', error);
        if (error?.response) {
          console.error('Status:', error.response.status, 'Data:', error.response.data);
        }
        // dejar posts como estaba o vacío; no lanzamos para que UI pueda manejar
      }
    },

    // Crear post (backend toma user/username del token en tu controller)
    async addPost(post: { title: string; content: string; club: string }) {
      try {
        const response = await createPost(post);
        console.log('✅ Post creado, status:', response.status);
        // Re-fetch para obtener el post con username normalizado
        await this.fetchPosts();
      } catch (error: any) {
        console.error('❌ Error al crear post:', error);
        if (error?.response) {
          console.error('Status:', error.response.status, 'Data:', error.response.data);
        }
        throw error;
      }
    },

    // Eliminar post
    async removePost(id: string) {
      try {
        const response = await deletePost(id);
        console.log('✅ Post eliminado, status:', response.status);
        this.posts = this.posts.filter((p) => p._id !== id);
        this.likedByUser = this.likedByUser.filter((pid) => pid !== id);
        delete this.comments[id];
      } catch (error: any) {
        console.error('❌ Error al eliminar post:', error);
        if (error?.response) {
          console.error('Status:', error.response.status, 'Data:', error.response.data);
        }
        throw error;
      }
    },

    // Likes
    async addLike(postId: string) {
      try {
        const resp = await apiAddLike(postId);
        console.log('✅ Like añadido, status:', resp.status);
        const idx = this.posts.findIndex((p) => p._id === postId);
        if (idx !== -1) {
          this.posts[idx].likesCount = resp.data?.likesCount ?? this.posts[idx].likesCount;
        }
        const payload = getUserFromToken();
        const userId = payload?.sub;
        if (userId && !this.likedByUser.includes(postId)) {
          this.likedByUser.push(postId);
        }
      } catch (error: any) {
        console.error('❌ Error al dar like:', error);
        if (error?.response) {
          console.error('Status:', error.response.status, 'Data:', error.response.data);
        }
        throw error;
      }
    },

    async removeLike(postId: string) {
      try {
        const resp = await apiRemoveLike(postId);
        console.log('✅ Like removido, status:', resp.status);
        const idx = this.posts.findIndex((p) => p._id === postId);
        if (idx !== -1) {
          this.posts[idx].likesCount = resp.data?.likesCount ?? this.posts[idx].likesCount;
        }
        this.likedByUser = this.likedByUser.filter((pid) => pid !== postId);
      } catch (error: any) {
        console.error('❌ Error al quitar like:', error);
        if (error?.response) {
          console.error('Status:', error.response.status, 'Data:', error.response.data);
        }
        throw error;
      }
    },

    // Comentarios
    async fetchComments(postId: string): Promise<CommentItem[]> {
      try {
        const resp = await apiFetchComments(postId);
        console.log('✅ Comentarios obtenidos, status:', resp.status);
        this.comments[postId] = Array.isArray(resp.data) ? (resp.data as CommentItem[]) : [];
        return this.comments[postId];
      } catch (error: any) {
        console.error('❌ Error al obtener comentarios:', error);
        if (error?.response) {
          console.error('Status:', error.response.status, 'Data:', error.response.data);
        }
        return [];
      }
    },

    async addComment(postId: string, content: string) {
      try {
        const resp = await apiAddComment(postId, content);
        console.log('✅ Comentario añadido, status:', resp.status);
        await this.fetchComments(postId);
      } catch (error: any) {
        console.error('❌ Error al agregar comentario:', error);
        if (error?.response) {
          console.error('Status:', error.response.status, 'Data:', error.response.data);
        }
        throw error;
      }
    },

    async removeComment(postId: string, commentId: string) {
      try {
        const resp = await apiRemoveComment(postId, commentId);
        console.log('✅ Comentario eliminado, status:', resp.status);
        await this.fetchComments(postId);
      } catch (error: any) {
        console.error('❌ Error al eliminar comentario:', error);
        if (error?.response) {
          console.error('Status:', error.response.status, 'Data:', error.response.data);
        }
        throw error;
      }
    },
  },
});
