import { defineStore } from 'pinia'
import { getPosts, createPost, deletePost } from '@/providers/miapi'

export const usePostsStore = defineStore('posts', {
  state: () => ({
    posts: [] as Array<{ _id: string; title: string; content: string; club: string; user: string }>
  }),
  actions: {
    /**
     * Carga **todos** los posts desde la API
     */
    async fetchPosts() {
      try {
        const response = await getPosts()
        this.posts = response.data
      } catch (error) {
        console.error('Error al obtener posts:', error)
      }
    },

    /**
     * Crea un nuevo post y recarga la lista
     */
    async addPost(post: { title: string; content: string; club: string; user: string }) {
      try {
        await createPost(post)
        await this.fetchPosts()
      } catch (error) {
        console.error('Error al crear post:', error)
      }
    },

    /**
     * Elimina un post local y en el servidor
     */
    async removePost(id: string) {
      try {
        await deletePost(id)
        this.posts = this.posts.filter(p => p._id !== id)
      } catch (error) {
        console.error('Error al eliminar post:', error)
      }
    }
  }
})
