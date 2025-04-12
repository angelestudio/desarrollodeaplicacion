<template>
    <div class="min-h-screen bg-black text-white flex flex-col md:flex-row">
      <aside class="md:w-1/4 w-full bg-black border-r border-gray-700">
        <miSidebarMenu />
      </aside>
  
      <main class="md:w-1/2 w-full bg-black flex flex-col relative pt-8">
        <miHeaderSection />
  
        <div v-if="filteredPosts.length > 0" class="flex flex-col space-y-4">
          <miPostCard
            v-for="post in filteredPosts"
            :key="post._id"
            :title="post.title"
            :subtitle="post.content"
            :postId="post._id"
            :club="post.club"
            @update="handleUpdate(post._id)"
            @delete="handleDelete(post._id)"
          />
        </div>
        <div v-else class="text-center text-gray-400 mt-10">
          No hay publicaciones disponibles.
        </div>
  
        <div class="fixed bottom-6 right-6">
          <miButtonAtom
            class="rounded-full w-14 h-14 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white shadow-lg text-2xl"
            @click="handleCreate"
          >
            +
          </miButtonAtom>
        </div>
      </main>
  
      <aside class="md:w-1/4 w-full bg-black border-l border-gray-700 p-4">
        <miTextInputAtom placeholder="Search" name="search" class="mb-4" />
        <miWidgetInfo />
      </aside>
    </div>
  </template>
  <script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import { usePostsStore } from '@/stores/postsStore'
  import { validatePost } from '@/composables/validate-post' // ✅ Importación corregida
  
  import miSidebarMenu from '@/components/molecules/miSidebarMenu.vue'
  import miHeaderSection from '@/components/molecules/miHeaderSection.vue'
  import miPostCard from '@/components/molecules/miPostCard.vue'
  import miButtonAtom from '@/components/atoms/miButtonAtom.vue'  
  import miTextInputAtom from '@/components/atoms/miTextInputAtom.vue'
  import miWidgetInfo from '@/components/molecules/miWidgetInfo.vue'
  
  const postsStore = usePostsStore()
  
  // Lista de clubs permitidos (en minúsculas para la comparación)
  const chosenClubs = ['fútbol', 'ajedrez', 'tenis', 'golf', 'matematicas', 'ingles']
  
  const filteredPosts = computed(() =>
    postsStore.posts.filter(post =>
      post.club && chosenClubs.includes(post.club.toLowerCase())
    )
  )
  
  onMounted(async () => {
    await reloadFilteredPosts()
  })
  
  async function handleDelete(postId: string): Promise<void> {
    if (!postId) return
    await postsStore.removePost(postId)
    await reloadFilteredPosts()
  }
  
  async function handleUpdate(postId: string): Promise<void> {
  if (!postId) return

  const newTitle = prompt('Ingresa el nuevo título:') ?? ''
  const newContent = prompt('Ingresa el nuevo contenido:') ?? ''

  const updatedPost = {
    title: newTitle,
    content: newContent,
    club: 'club temporal'
  }

  if (validatePost(updatedPost)) {
    await postsStore.editPost(postId, {
      title: newTitle,
      content: newContent
    })
    await reloadFilteredPosts()
  } else {
    alert('Error de validación: faltan campos.')
  }
}

async function handleCreate(): Promise<void> {
  const title = prompt('Ingresa el título:') ?? ''
  const content = prompt('Ingresa el contenido:') ?? ''
  const club = 'Fútbol'

  const newPost = {
    title,
    content,
    club,
    user: '@david'
  }

  if (validatePost(newPost)) {
    await postsStore.addPost(newPost)
    await reloadFilteredPosts()
  } else {
    alert('Error de validación: faltan campos.')
  }
}
  async function reloadFilteredPosts() {
    await postsStore.fetchPosts()
  }
  </script>