<template>
  <div
    class="flex-1 flex flex-col p-8 overflow-y-auto border-r h-full"
    :class="isDarkMode ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-100'"
  >
    <!-- Header igual al de clubs -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-emerald-500 mb-1">
        NOTIFICACIONES
      </h2>
      <p class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">
        Mantente al día con las últimas actualizaciones
      </p>
    </div>

    <!-- Sección Notificaciones con tamaño uniforme -->
    <section class="mb-8">
      <h3 class="text-lg font-semibold mb-6" :class="isDarkMode ? 'text-gray-200' : 'text-gray-800'">
        Todas las Notificaciones
      </h3>
      <div class="grid gap-6 max-w-2xl mx-auto w-full">

        <div
          class="rounded-2xl flex items-start border transition-all duration-200 hover:shadow-md"
          :class="isDarkMode ? 'bg-gray-900 border-gray-800 hover:border-gray-700' : 'bg-gray-50 border-gray-200 hover:border-gray-300'"
          style="padding: 2rem; min-height: 150px; width: 100%;"
        >
          <img src="https://i.pravatar.cc/300?img=5" alt="User" 
               style="width: 60px; height: 60px;" 
               class="rounded-full border-emerald-500 flex-shrink-0" 
               :style="{ borderWidth: '3px', borderStyle: 'solid' }" />
          <div style="margin-left: 1.5rem; flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: center;">
            <div style="font-weight: 600; font-size: 1.125rem; margin-bottom: 0.75rem;" 
                 :class="isDarkMode ? 'text-white' : 'text-gray-900'">
              Tania Rodriguez
            </div>
            <div style="font-size: 1rem; margin-bottom: 1rem;" 
                 :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
              Nueva actualización del sistema disponible
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              <div style="width: 100%; height: 8px; border-radius: 4px;" 
                   :class="isDarkMode ? 'bg-gray-800' : 'bg-gray-300'"></div>
              <div style="width: 83.333333%; height: 8px; border-radius: 4px;" 
                   :class="isDarkMode ? 'bg-gray-800' : 'bg-gray-300'"></div>
              <div style="width: 66.666667%; height: 8px; border-radius: 4px;" 
                   :class="isDarkMode ? 'bg-gray-800' : 'bg-gray-300'"></div>
            </div>
            <div style="margin-top: 1rem; font-size: 0.75rem;" 
                 :class="isDarkMode ? 'text-gray-500' : 'text-gray-400'">
              Hace 2 horas
            </div>
          </div>
        </div>

        <div
          class="rounded-2xl flex items-start border transition-all duration-200 hover:shadow-md"
          :class="isDarkMode ? 'bg-gray-900 border-gray-800 hover:border-gray-700' : 'bg-gray-50 border-gray-200 hover:border-gray-300'"
          style="padding: 2rem; min-height: 150px; width: 100%;"
        >
          <img src="https://i.pravatar.cc/300?img=12" alt="User" 
               style="width: 60px; height: 60px;" 
               class="rounded-full border-emerald-500 flex-shrink-0" 
               :style="{ borderWidth: '3px', borderStyle: 'solid' }" />
          <div style="margin-left: 1.5rem; flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: center;">
            <div style="font-weight: 600; font-size: 1.125rem; margin-bottom: 0.75rem;" 
                 :class="isDarkMode ? 'text-white' : 'text-gray-900'">
              Camilo Sanchez
            </div>
            <div style="font-size: 1rem; margin-bottom: 1rem;" 
                 :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
              Te mencionó en un comentario
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              <div style="width: 100%; height: 8px; border-radius: 4px;" 
                   :class="isDarkMode ? 'bg-gray-800' : 'bg-gray-300'"></div>
              <div style="width: 50%; height: 8px; border-radius: 4px;" 
                   :class="isDarkMode ? 'bg-gray-800' : 'bg-gray-300'"></div>
            </div>
            <div style="margin-top: 1rem; font-size: 0.75rem;" 
                 :class="isDarkMode ? 'text-gray-500' : 'text-gray-400'">
              Hace 5 horas
            </div>
          </div>
        </div>

        <div
          class="rounded-2xl flex items-start border transition-all duration-200 hover:shadow-md"
          :class="isDarkMode ? 'bg-gray-900 border-gray-800 hover:border-gray-700' : 'bg-gray-50 border-gray-200 hover:border-gray-300'"
          style="padding: 2rem; min-height: 150px; width: 100%;"
        >
          <img src="https://i.pravatar.cc/300?img=8" alt="User" 
               style="width: 60px; height: 60px;" 
               class="rounded-full border-emerald-500 flex-shrink-0" 
               :style="{ borderWidth: '3px', borderStyle: 'solid' }" />
          <div style="margin-left: 1.5rem; flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: center;">
            <div style="font-weight: 600; font-size: 1.125rem; margin-bottom: 0.75rem;" 
                 :class="isDarkMode ? 'text-white' : 'text-gray-900'">
              María González
            </div>
            <div style="font-size: 1rem; margin-bottom: 1rem;" 
                 :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
              Nuevo evento programado para mañana
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              <div style="width: 100%; height: 8px; border-radius: 4px;" 
                   :class="isDarkMode ? 'bg-gray-800' : 'bg-gray-300'"></div>
              <div style="width: 66.666667%; height: 8px; border-radius: 4px;" 
                   :class="isDarkMode ? 'bg-gray-800' : 'bg-gray-300'"></div>
              <div style="width: 83.333333%; height: 8px; border-radius: 4px;" 
                   :class="isDarkMode ? 'bg-gray-800' : 'bg-gray-300'"></div>
            </div>
            <div style="margin-top: 1rem; font-size: 0.75rem;" 
                 :class="isDarkMode ? 'text-gray-500' : 'text-gray-400'">
              Hace 1 día
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- Botón crear notificación (solo para admin) -->
    <button
      v-if="isAdmin"
      class="fixed bottom-20 right-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl shadow-lg transition-all duration-200 z-30 font-medium text-sm"
      style="padding: 1rem 1.5rem;"
    >
      Crear Notificación
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { getUserFromToken } from '@/composables/useAuth';
import { useThemeStore } from '@/stores/theme';

const themeStore = useThemeStore()
const isDarkMode = computed(() => themeStore.theme === 'dark')

// Variable para controlar si el usuario es admin
const isAdmin = ref(false);

onMounted(() => {
  const currentUser = getUserFromToken();
  if (currentUser && currentUser.rol === 'admin') {
    isAdmin.value = true;
  }
});
</script>