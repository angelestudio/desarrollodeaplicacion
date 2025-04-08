<template>
  <div class="flex h-screen bg-black text-white">
    <aside class="w-1/4 p-4 flex flex-col justify-between border-r border-gray-700">
      <miSidebarMenu />
      <div class="mt-4">
        <button @click="onAddClub" class="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-center font-semibold mb-4">
          + Club
        </button>
        <p class="text-gray-400">@David</p>
      </div>
    </aside>
    <main class="flex-1 p-4 overflow-y-auto">
      <h2 class="text-2xl font-bold mb-6">SELECT YOUR FAVORITES</h2>
      <section class="mb-8">
        <h3 class="text-xl font-semibold mb-4">Sports</h3>
        <div class="space-y-4">
          <div class="bg-gray-800 p-4 rounded flex justify-between items-center" v-for="item in sports" :key="item.name">
            <div>
              <router-link :to="{ name: 'UserPosts', query: { club: item.name } }" class="font-semibold text-white hover:underline">
                {{ item.name }}
              </router-link>
              <p class="text-sm text-gray-400">{{ item.description }}</p>
            </div>
            <button class="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">Join</button>
          </div>
        </div>
      </section>
      <section v-if="clubsStore.clubs.length">
        <h3 class="text-xl font-semibold mb-4">Mis Clubs</h3>
        <div class="space-y-4">
          <div v-for="club in clubsStore.clubs" :key="club._id" class="bg-gray-800 p-4 rounded flex justify-between items-center">
            <div>
              <router-link :to="{ name: 'UserPosts', query: { club: club.name } }" class="text-lg font-semibold hover:underline">
                {{ club.name }}
              </router-link>
              <p class="text-sm text-gray-400">{{ club.description }}</p>
            </div>
            <button @click="onDeleteClub(club._id)" class="bg-red-600 hover:bg-red-700 rounded px-2 py-1 text-sm text-white">
              Eliminar
            </button>
          </div>
        </div>
      </section>
    </main>
    <aside class="w-1/4 p-4 border-l border-gray-700">
      <miTextInputAtom placeholder="Search" class="mb-4" />
      <div class="bg-gray-800 p-4 rounded">
        <h3 class="font-semibold mb-2">What happens?</h3>
        <ul class="text-sm space-y-1">
          <li>noticias cef</li>
          <li>actividad terraza</li>
          <li>apoyo de sostenimiento</li>
          <li>película sabrosona</li>
          <li>talleres</li>
          <li>inglés y otras oportunidades</li>
        </ul>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import miSidebarMenu from '@/components/molecules/miSidebarMenu.vue'
import miTextInputAtom from '@/components/atoms/miTextInputAtom.vue'
import { useClubsStore } from '@/stores/clubsStore'

// Si deseas definir la sección de "sports" de forma dinámica, puedes crear un arreglo con los datos:
const sports = [
  { name: 'Fútbol', description: 'Donde nacen los verdaderos cracks' },
  { name: 'Ping Pong', description: 'Reflejos, ritmo y diversión' },
  { name: 'Ajedrez', description: 'Mueve tu mente, gana estrategia' }
]

const clubsStore = useClubsStore()

onMounted(() => {
  clubsStore.fetchClubs()
})

const onAddClub = async () => {
  const name = prompt("Ingresa el nombre del club:")
  if (!name) return
  const description = prompt("Ingresa la descripción del club:") || ""
  await clubsStore.createClub({ name, description })
}

const onDeleteClub = async (id: string) => {
  if (confirm("¿Estás seguro de eliminar este club?")) {
    await clubsStore.deleteClub(id)
  }
}
</script>

<style scoped>

</style>