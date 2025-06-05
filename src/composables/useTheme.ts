// composables/useTheme.ts
import { ref, computed, watch, type Ref, type ComputedRef } from 'vue'

// Interfaces
export interface ThemeClasses {
  bgPrimary: string
  bgSecondary: string
  textPrimary: string
  textSecondary: string
  borderColor: string
  borderIcon: string
  buttonTheme: string
  navButton: string
  navButtonHover: string
  cardBg: string
  inputBg: string
  hoverBg: string
}

export interface ThemeConfig {
  isDarkTheme: Ref<boolean>
  themeClasses: ComputedRef<ThemeClasses>
  toggleTheme: () => void
  setTheme: (isDark: boolean) => void
  initTheme: () => void
}

// Estado global del tema
const isDarkTheme = ref<boolean>(true)

export function useTheme(): ThemeConfig {
  
  // Computed para todas las clases de tema
  const themeClasses = computed<ThemeClasses>(() => ({
    // Fondos principales
    bgPrimary: isDarkTheme.value ? 'bg-black' : 'bg-white',
    bgSecondary: isDarkTheme.value ? 'bg-gray-900' : 'bg-gray-50',
    
    // Textos
    textPrimary: isDarkTheme.value ? 'text-white' : 'text-black',
    textSecondary: isDarkTheme.value ? 'text-gray-300' : 'text-gray-600',
    
    // Bordes
    borderColor: isDarkTheme.value ? 'border-gray-800' : 'border-gray-200',
    borderIcon: isDarkTheme.value ? 'border-white' : 'border-black',
    
    // Botones
    buttonTheme: isDarkTheme.value 
      ? 'bg-gray-800 hover:bg-gray-700 text-white' 
      : 'bg-gray-100 hover:bg-gray-200 text-black',
    
    // Navegación
    navButton: isDarkTheme.value 
      ? 'bg-gray-900 text-white' 
      : 'bg-gray-100 text-black',
    navButtonHover: isDarkTheme.value 
      ? 'hover:bg-green-700' 
      : 'hover:bg-green-100 hover:text-green-800',
    
    // Cards y otros elementos
    cardBg: isDarkTheme.value ? 'bg-gray-800' : 'bg-white',
    inputBg: isDarkTheme.value ? 'bg-gray-700' : 'bg-gray-50',
    hoverBg: isDarkTheme.value ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
  }))

  // Métodos
  const toggleTheme = (): void => {
    isDarkTheme.value = !isDarkTheme.value
  }

  const setTheme = (isDark: boolean): void => {
    isDarkTheme.value = isDark
  }

  const initTheme = (): void => {
    try {
      const savedTheme = localStorage.getItem('isDarkTheme')
      if (savedTheme !== null) {
        isDarkTheme.value = JSON.parse(savedTheme)
      }
    } catch (error) {
      console.warn('Error loading theme from localStorage:', error)
      isDarkTheme.value = true // fallback al tema oscuro
    }
  }

  // Watcher para guardar en localStorage
  watch(isDarkTheme, (newValue: boolean) => {
    try {
      localStorage.setItem('isDarkTheme', JSON.stringify(newValue))
    } catch (error) {
      console.warn('Error saving theme to localStorage:', error)
    }
  }, { immediate: false })

  return {
    isDarkTheme,
    themeClasses,
    toggleTheme,
    setTheme,
    initTheme
  }
}

// Hook para inicializar el tema en la aplicación principal
export function initializeTheme(): void {
  const { initTheme } = useTheme()
  initTheme()
}