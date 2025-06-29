<template>
  <div class="p-6 bg-green-100 min-h-screen">
    <!-- Botón de volver -->
    <div class="mb-4">
      <router-link
        to="/profile"
        class="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded shadow"
      >
        ← Volver al perfil
      </router-link>
    </div>

    <h1 class="text-3xl font-bold mb-6 text-green-900">Reporte del Sistema</h1>

    <!-- Usuarios -->
    <section class="mb-10">
      <h2 class="text-2xl font-semibold text-green-800 mb-2">Usuarios</h2>
      <div class="overflow-auto rounded shadow bg-white">
        <table class="min-w-full table-auto text-sm">
          <thead class="bg-green-200 text-green-900">
            <tr>
              <th class="p-2 text-left">Nombre</th>
              <th class="p-2 text-left">Correo</th>
              <th class="p-2 text-left">Rol</th>
              <th class="p-2 text-left">Clubs</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in reporte.usuarios" :key="user._id" class="border-b">
              <td class="p-2">{{ user.firstName }} {{ user.lastName }}</td>
              <td class="p-2">{{ user.email }}</td>
              <td class="p-2">{{ user.role }}</td>
              <td class="p-2">{{ user.clubs?.join(', ') || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Posts -->
    <section>
      <h2 class="text-2xl font-semibold text-green-800 mb-2">Posts</h2>
      <div class="space-y-4">
        <div v-for="post in reporte.posts" :key="post._id" class="p-4 bg-white shadow rounded">
          <h3 class="text-xl font-bold text-green-900">{{ post.title }}</h3>
          <p class="text-green-800 mb-1">{{ post.content }}</p>
          <p class="text-sm text-green-600">Club: {{ post.club }} | Likes: {{ post.likesCount }}</p>

          <div class="mt-3">
            <h4 class="font-semibold text-green-700">Comentarios:</h4>
            <ul class="list-disc list-inside text-sm text-green-700">
              <li v-for="comentario in post.comentarios" :key="comentario._id">
                <strong>{{ comentario.username }}:</strong> {{ comentario.content }}
              </li>
              <li v-if="post.comentarios.length === 0" class="text-gray-500">Sin comentarios</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

// --- Tipos para los datos del reporte ---
interface Usuario {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: string
  clubs: string[]
}

interface Comentario {
  _id: string
  postId: string
  userId: string
  username: string
  content: string
}

interface Post {
  _id: string
  title: string
  content: string
  club: string
  user: string
  likedBy: string[]
  likesCount: number
  comentarios: Comentario[]
}

interface Reporte {
  usuarios: Usuario[]
  posts: Post[]
}

// --- Variable reactiva con el tipo correcto ---
const reporte = ref<Reporte>({
  usuarios: [],
  posts: [],
})

// --- Cargar los datos al montar la vista ---
onMounted(async () => {
  try {
    const res = await axios.get<Reporte>('http://localhost:3000/report')
    reporte.value = res.data
  } catch (err) {
    console.error('Error al cargar el reporte:', err)
  }
})
</script>

<style scoped>
table th,
table td {
  border: 1px solid #c4f0c4;
}
</style>
