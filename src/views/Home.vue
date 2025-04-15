<template>
  <div class="min-h-screen overflow-y-auto bg-black text-white flex relative">
    <div v-if="showModal" class="absolute inset-0 backdrop-blur-sm bg-black/50 z-40"></div>
    <div v-if="showModal" class="fixed z-50 inset-0 flex items-center justify-center">
      <div class="bg-gray-900 p-6 rounded-xl shadow-lg w-full max-w-md relative overflow-y-auto max-h-[80vh]">
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
              class="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
            />
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">Contenido</label>
            <textarea
              v-model="newPost.content"
              required
              class="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
            ></textarea>
          </div>
          <div class="mb-3" v-if="!selectedClub">
            <label class="block text-sm mb-1">Selecciona un club</label>
            <select v-model="selectedFormClub" class="w-full p-2 rounded bg-gray-800 text-white border border-gray-600">
              <option disabled value="">-- Selecciona un club --</option>
              <option v-for="club in clubs" :key="club" :value="club">{{ club }}</option>
            </select>
          </div>
          <div class="mb-3" v-else>
            <p class="text-sm text-green-400">Este post se asociará al club: <strong>{{ selectedClub }}</strong></p>
          </div>
          <button type="submit" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
            Crear
          </button>
        </form>
      </div>
    </div>
    <aside class="w-1/4 bg-black border-r border-gray-700 h-full">
      <miSidebarMenu />
    </aside>
    <main class="w-2/4 bg-black flex flex-col relative p-4">
      <div class="flex items-center justify-center">
        <router-link to="/clubs" class="block text-white mb-2 hover:underline">
          todos los clubs
        </router-link>
        <div class="mx-4"></div>
        <router-link to="/user-posts" class="block text-white mb-2 hover:underline">
          mis clubs
        </router-link>
      </div>
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">Posts</h2>
        <button
          @click="onAddPost"
          class="bg-blue-600 hover:bg-blue-700 rounded-full w-8 h-8 flex items-center justify-center"
          title="Agregar post"
        >
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
        <div
          v-for="post in filteredPosts"
          :key="post._id"
          class="bg-gray-800 p-4 rounded mb-2 relative"
        >
          <h3 class="text-xl font-semibold">{{ post.title }}</h3>
          <p class="text-gray-400">{{ post.content }}</p>
          <span class="text-sm text-gray-500">Club: {{ post.club }}</span>
          <button
            v-if="user && user.role === 'admin'"
            @click="onDeletePost(post._id)"
            class="absolute top-2 right-2 bg-red-600 hover:bg-red-700 rounded px-2 py-1 text-sm"
            title="Eliminar post"
          >
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import miSidebarMenu from '@/components/molecules/miSidebarMenu.vue'
import miTextInputAtom from '@/components/atoms/miTextInputAtom.vue'
import miWidgetInfo from '@/components/molecules/miWidgetInfo.vue'
import { getPostsByUser, createPost, deletePost } from '@/providers/miapi'
import type { Post } from '@/types/commons'
import { useLoginStore } from '@/stores/milogin';
import { useClubsStore } from '@/stores/clubsStore'

const route = useRoute()
const posts = ref<Post[]>([])
const showModal = ref(false)
const newPost = ref({ title: '', content: '' })
const selectedClub = ref<string>('') // Club seleccionado a nivel global
const selectedFormClub = ref<string>('') // Club seleccionado desde el formulario
  const auth = useLoginStore();
const user = computed(() => auth.user)
const clubsStore = useClubsStore()

onMounted(async () => {
  await clubsStore.fetchClubs()
  if (route.query.club) {
    selectedClub.value = route.query.club as string
  }
  const response = await getPostsByUser(user.value?.username || '@david')
  posts.value = response.data
})

const clubs = computed(() => {
  return user.value?.clubs && user.value.clubs.length
         ? user.value.clubs
         : clubsStore.clubs.map(c => c.name)
})

const filteredPosts = computed(() => {
  if (!selectedClub.value) {
    const clubsList = user.value?.clubs && user.value.clubs.length
      ? user.value.clubs
      : clubsStore.clubs.map(c => c.name)
    return posts.value.filter(post => clubsList.includes(post.club))
  }
  return posts.value.filter(post => post.club === selectedClub.value)
})

const filterByClub = (club: string) => {
  selectedClub.value = club
}

const onAddPost = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  newPost.value = { title: '', content: '' }
  selectedFormClub.value = ''
}

const submitPost = async () => {
  // Se utiliza el club seleccionado global o el del formulario si no hay global seleccionado
  const clubToSend = selectedClub.value || selectedFormClub.value
  if (!clubToSend) {
    alert('Debes seleccionar un club para asociar el post.')
    return
  }
  if (!newPost.value.title || !newPost.value.content) return
  const postToSend = {
    title: newPost.value.title,
    content: newPost.value.content,
    club: clubToSend,
    user: user.value?.username || '@david'
  }
  const { data } = await createPost(postToSend)
  posts.value.push(data)
  closeModal()
}

const onDeletePost = async (id: string) => {
  if (user.value?.role !== 'admin') return
  if (confirm('¿Seguro que deseas eliminar este post?')) {
    await deletePost(id)
    posts.value = posts.value.filter(p => p._id !== id)
  }
}

watch(showModal, (val) => {
  if (val) {
    document.body.classList.add('modal-open')
  } else {
    document.body.classList.remove('modal-open')
  }
})
</script>

<style>
html, body {
  background-color: black;
  margin: 0;
  padding: 0;
}
.modal-open {
  overflow: hidden;
}
</style>