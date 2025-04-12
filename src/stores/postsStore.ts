import { defineStore } from 'pinia';
import { getPosts, createPost, updatePost, deletePost } from '@/providers/miapi';

export const usePostsStore = defineStore('posts', {
  state: () => ({
    posts: [] as any[]
  }),
  actions: {
    async fetchPosts() {
      try {
        const response = await getPosts();
        this.posts.splice(0, this.posts.length, ...response.data);
      } catch (error) {
        console.error('Error al obtener posts:', error);
      }
    },
    async addPost(post: { title: string; content: string; club: string }) {
      try {
        await createPost(post);
        await this.fetchPosts();
      } catch (error) {
        console.error('Error al crear post:', error);
      }
    },
    async editPost(id: string | number, data: Partial<{ title: string; content: string }>) {
      try {
        const response = await updatePost(String(id), data);
        const index = this.posts.findIndex(post => post._id === id);
        if (index !== -1) {
          this.posts[index] = { ...this.posts[index], ...response.data };
        }
      } catch (error) {
        console.error('Error al actualizar post:', error);
      }
    },
    async removePost(id: string | number) {
      try {
        await deletePost(String(id));
        this.posts = this.posts.filter(post => post._id !== id);
      } catch (error) {
        console.error('Error al eliminar post:', error);
      }
    }
  }
});