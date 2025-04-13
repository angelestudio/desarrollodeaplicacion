<template>
    <div class="h-screen bg-black text-white flex">
      <aside class="w-1/4 bg-black border-r border-gray-700 h-full">
        <miSidebarMenu />
      </aside>
      <main class="w-2/4 bg-black flex flex-col relative p-4">
        <div class="flex items-center justify-center">
          <router-link to="/angpost.vue" class="block text-white mb-2 hover:underline">
            todos los clubs
          </router-link>
          <div class="mx-4"></div>
          <router-link to="/anguserposts" class="block text-white mb-2 hover:underline">
            mis clubs
          </router-link>
        </div>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">Posts</h2>
          <button @click="onAddPost" class="bg-blue-600 hover:bg-blue-700 rounded-full w-8 h-8 flex items-center justify-center" title="Agregar post">
            +
          </button>
        </div>
        <div class="overflow-x-auto whitespace-nowrap mb-4">
          <button
            v-for="club in clubs"
            :key="club"
            @click="filterByClub(club)"
            class="inline-block px-4 py-2 mr-2 bg-gray-700 hover:bg-gray-600 rounded-full"
          >
            {{ club }}
          </button>
        </div>
        <div v-if="filteredPosts.length">
          <div v-for="post in filteredPosts" :key="post._id" class="bg-gray-800 p-4 rounded mb-2 relative">
            <h3 class="text-xl font-semibold">{{ post.title }}</h3>
            <p class="text-gray-400">{{ post.content }}</p>
            <span class="text-sm text-gray-500">Club: {{ post.club }}</span>
            <button @click="onDeletePost(post._id)" class="absolute top-2 right-2 bg-red-600 hover:bg-red-700 rounded px-2 py-1 text-sm" title="Eliminar post">
              Delete
            </button>
          </div>
        </div>
        <div v-else>
          <p>No hay posts disponibles.</p>
        </div>
      </main>
      <aside class="w-1/4 bg-black border-l border-gray-700 p-4">
        <miTextInputAtom placeholder="Search" class="mb-4" />
        <miWidgetInfo />
      </aside>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted, ref, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import miSidebarMenu from '@/components/molecules/miSidebarMenu.vue'
  import miTextInputAtom from '@/components/atoms/miTextInputAtom.vue'
  import miWidgetInfo from '@/components/molecules/miWidgetInfo.vue'
  import { getPostsByUser, createPost, deletePost } from '@/providers/miapi'
  import type { Post } from '@/types/commons'
  import { useClubsStore } from '@/stores/clubsStore'
  
  const posts = ref<Post[]>([])
  const selectedClub = ref<string>('Fútbol')
  const route = useRoute()
  const clubsStore = useClubsStore()
  
  onMounted(async () => {
    await clubsStore.fetchClubs()
    if (route.query.club) {
      selectedClub.value = route.query.club as string
    }
    const response = await getPostsByUser('@david')
    posts.value = response.data
  })
  
  const clubs = computed(() => clubsStore.clubs.map(c => c.name))
  
  const filteredPosts = computed(() => {
    if (!selectedClub.value) return posts.value
    return posts.value.filter(post => post.club === selectedClub.value)
  })
  
  const filterByClub = (club: string) => {
    selectedClub.value = club
  }
  
  const onAddPost = async () => {
    const title = prompt('Título del post:')
    if (!title) return
    const content = prompt('Contenido del post:') || ''
    const newPost = {
      title,
      content,
      club: selectedClub.value,
      user: '@david'
    }
    const { data } = await createPost(newPost)
    posts.value.push(data)
  }
  
  const onDeletePost = async (id: string) => {
    if (confirm('¿Seguro que deseas eliminar este post?')) {
      await deletePost(id)
      posts.value = posts.value.filter(p => p._id !== id)
    }
  }
  </script>
  
  <style scoped>
  /* Agrega estilos adicionales aquí si fuera necesario */
  </style>