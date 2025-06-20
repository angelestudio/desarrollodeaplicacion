<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { usePostsStore } from '@/stores/postsStore'
import { useLoginStore } from '@/stores/milogin'
import { useRoute } from 'vue-router'
import { validatePost } from '@/composables/validate-post'
import { useThemeStore } from '@/stores/theme' // <--- IMPORTANTE

import miSidebarMenu from '@/components/molecules/miSidebarMenu.vue'
import miHeaderSection from '@/components/molecules/miHeaderSection.vue'
import miPostCard from '@/components/molecules/miPostCard.vue'
import miButtonAtom from '@/components/atoms/miButtonAtom.vue'
import miTextInputAtom from '@/components/atoms/miTextInputAtom.vue'
import miWidgetInfo from '@/components/molecules/miWidgetInfo.vue'

const postsStore = usePostsStore()
const loginStore = useLoginStore()
const route = useRoute()

// Theme global Pinia
const themeStore = useThemeStore()
const isDarkMode = computed(() => themeStore.theme === 'dark')

// Obtiene el club seleccionado (por query) y se asegura de que siempre sea una cadena
const selectedClub = computed(() => {
  return route.query.club ? route.query.club.toString() : ''
})

// Filtrado de posts: solo se muestran aquellos que coinciden con el club seleccionado
const filteredPosts = computed(() =>
  postsStore.posts.filter(post =>
    post.club &&
    post.club.toLowerCase() === selectedClub.value.toLowerCase()
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
    club: selectedClub.value
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

async function reloadFilteredPosts() {
  await postsStore.fetchPosts()
}

// Variables y funciones para el modal de creación
const showModal = ref(false)
const newPost = ref({
  title: '',
  content: ''
})

function openModal() {
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  newPost.value = { title: '', content: '' }
}

async function submitPost() {
  const userName = loginStore.user?.firstName || 'Usuario'
  const postToCreate = {
    title: newPost.value.title,
    content: newPost.value.content,
    club: selectedClub.value,
    user: userName
  }
  if (validatePost(postToCreate)) {
    await postsStore.addPost(postToCreate)
    await reloadFilteredPosts()
    closeModal()
  } else {
    alert('Error de validación: faltan campos.')
  }
}

// Opcional: Deshabilitar scroll del background cuando el modal esté abierto
watch(showModal, (val) => {
  if (val) {
    document.body.classList.add('modal-open')
  } else {
    document.body.classList.remove('modal-open')
  }
})
</script>

<template>
  <div
    class="min-h-screen flex flex-col md:flex-row relative"
    :class="isDarkMode ? 'bg-black text-white' : 'bg-white text-black'"
  >
    <!-- Fondo borroso cuando el modal está abierto -->
    <div v-if="showModal" class="absolute inset-0 backdrop-blur-sm bg-black/50 z-40"></div>

    <!-- Modal para crear post -->
    <div v-if="showModal" class="fixed z-50 inset-0 flex items-center justify-center">
      <div
        class="p-6 rounded-xl shadow-lg w-full max-w-md relative"
        :class="isDarkMode ? 'bg-gray-900' : 'bg-white border border-gray-300'"
      >
        <!-- Botón de cerrar -->
        <button @click="closeModal" class="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl font-bold">
          ×
        </button>
        <h3 class="text-xl mb-4 font-semibold">Crear nuevo post</h3>
        <form @submit.prevent="submitPost">
          <div class="mb-3">
            <label class="block text-sm mb-1">Título</label>
            <input
              v-model="newPost.title"
              type="text"
              required
              class="w-full p-2 rounded border"
              :class="isDarkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-gray-100 text-black border-gray-300'"
            />
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">Contenido</label>
            <textarea
              v-model="newPost.content"
              required
              class="w-full p-2 rounded border"
              :class="isDarkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-gray-100 text-black border-gray-300'"
            ></textarea>
          </div>
          <button type="submit" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
            Crear
          </button>
        </form>
      </div>
    </div>

    <!-- Aside izquierdo -->
    <aside
      class="md:w-1/4 w-full border-r"
      :class="isDarkMode ? 'bg-black border-gray-700' : 'bg-white border-gray-200'"
    >
      <miSidebarMenu />
    </aside>
  
    <!-- Contenido principal -->
    <main
      class="md:w-1/2 w-full flex flex-col relative pt-8"
      :class="isDarkMode ? 'bg-black' : 'bg-white'"
    >
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
      <div v-else :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'" class="text-center mt-10">
        No hay publicaciones disponibles.
      </div>
  
      <!-- Botón fijo para abrir modal de creación -->
      <div class="fixed bottom-6 right-6">
        <miButtonAtom
          class="rounded-full w-14 h-14 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white shadow-lg text-2xl"
          @click="openModal"
        >
          +
        </miButtonAtom>
      </div>
    </main>
  
    <!-- Aside derecho -->
    <aside
      class="md:w-1/4 w-full border-l p-4"
      :class="isDarkMode ? 'bg-black border-gray-700' : 'bg-white border-gray-200'"
    >
      <miTextInputAtom placeholder="Search" name="search" class="mb-4" />
      <miWidgetInfo />
    </aside>
  </div>
</template>

<style scoped>
.modal-open {
  overflow: hidden;
}
</style>