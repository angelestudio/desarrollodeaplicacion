import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // 1. Lee el valor inicial desde localStorage, o usa 'dark' como default.
  const theme = ref<'dark' | 'light'>((localStorage.getItem('theme') as 'dark' | 'light') || 'dark')

  // 2. Esta función ahora solo necesita actualizar el valor en el ref.
  const setTheme = (newTheme: 'dark' | 'light') => {
    theme.value = newTheme
  }

  // 3. Esta función también solo actualiza el ref.
  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  // 4. (La magia) Usamos 'watch' para guardar en localStorage CUALQUIER cambio en 'theme'.
  // Esto simplifica las acciones, ya que no necesitan preocuparse por guardar el estado.
  watch(theme, (newTheme) => {
    localStorage.setItem('theme', newTheme)
  })

  return {
    theme,
    setTheme,
    toggleTheme
  }
})
