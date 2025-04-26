<script setup lang="ts">





interface NewsItem {
  _id?: string
  title: string
  content: string
  createdAt?: string
}

// Reactive state
const title = ref('');
const content = ref('');
const newsItems = ref<NewsItem[]>([]);
const notificationMessage = ref('');
const notificationType = ref<'success' | 'error'>('success');
const showNotification = ref(false);
const isLoading = ref(false);

// API base URL
const API_URL = 'http://localhost:3000/news';

// Fetch existing news when component mounts
onMounted(async () => {
  await fetchNews();
});

// Function to fetch all news from the API
const fetchNews = async () => {
  try {
    isLoading.value = true;
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    newsItems.value = data;
  } catch (error) {
    console.error('Failed to fetch news:', error);
    displayNotification('Error al cargar noticias', 'error');
  } finally {
    isLoading.value = false;
  }
};

// Function to publish a new news item
const publishNews = async () => {
  // Validate inputs
  if (!title.value.trim() || !content.value.trim()) {
    displayNotification('Por favor, completa tanto el título como el contenido de la noticia.', 'error');
    return;
  }

  try {
    isLoading.value = true;
    
    // Create news item object
    const newNewsItem: NewsItem = {
      title: title.value.trim(),
      content: content.value.trim()
    };
    
    // Send to API
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newNewsItem),
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    // Get the response which contains message and newsId
    const result = await response.json();
    
    // Refetch the news to get the latest data including the new item
    await fetchNews();
    
    // Clear form
    title.value = '';
    content.value = '';
    
    // Show success message
    displayNotification('Noticia publicada con éxito!', 'success');
  } catch (error) {
    console.error('Error publishing news:', error);
    displayNotification('Error al publicar la noticia. Inténtalo de nuevo.', 'error');
  } finally {
    isLoading.value = false;
  }
};

// Function to delete a news item
const deleteNews = async (id: string) => {
  if (!id) {
    displayNotification('ID de noticia no válido', 'error');
    return;
  }

  if (!confirm('¿Estás seguro de que quieres eliminar esta noticia?')) {
    return;
  }

  try {
    isLoading.value = true;
    
    // Send delete request con el ID correcto
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    // Si fue exitoso, actualizamos la lista de noticias
    await fetchNews();
    
    displayNotification('Noticia eliminada correctamente', 'success');
  } catch (error) {
    console.error('Error deleting news:', error);
    displayNotification('Error al eliminar la noticia', 'error');
  } finally {
    isLoading.value = false;
  }
};

// Function to display notification
const displayNotification = (message: string, type: 'success' | 'error' = 'success') => {
  notificationMessage.value = message;
  notificationType.value = type;
  showNotification.value = true;
  
  // Hide notification after 3 seconds
  setTimeout(() => {
    showNotification.value = false;
  }, 3000);
};

// Format date for display
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  } catch (e) {
    return dateString;
  }
};
</script>

<template>
  <div class="w-full bg-black border-l border-gray-800 flex flex-col">
    <!-- Barra de búsqueda -->
    <div class="p-3 border-b border-gray-800" id="search-container">
      <div class="bg-gray-900 rounded-full px-4 py-2 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
        </svg>
        <input type="text" placeholder="Search" class="bg-transparent border-none w-full ml-2 text-sm focus:outline-none text-gray-300">
      </div>
    </div>
    
    <!-- News creation form -->   
    <div class="bg-gray-900 p-3 mb-4 rounded-lg border border-gray-700">     
      <h3 class="text-blue-500 font-medium text-sm mb-2">Crear nueva noticia</h3>          
      <div class="mb-3">       
        <label for="news-title" class="block text-xs text-gray-400 mb-1">Título:</label>       
        <input         
          type="text"         
          id="news-title"         
          v-model="title"         
          class="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500"         
          placeholder="Título de la noticia"       
        >     
      </div>          
      <div class="mb-3">       
        <label for="news-content" class="block text-xs text-gray-400 mb-1">Contenido:</label>       
        <textarea         
          id="news-content"         
          v-model="content"         
          class="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500 h-24"         
          placeholder="Contenido de la noticia"       
        ></textarea>     
      </div>          
      <div class="flex justify-end">       
        <button         
          @click="publishNews"         
          :disabled="isLoading"         
          class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded transition duration-200 disabled:opacity-50"       
        >         
          <span v-if="isLoading">Publicando...</span>         
          <span v-else>Publicar noticia</span>       
        </button>     
      </div>   
    </div>    

    <!-- News items display -->   
    <div id="news-items-container" class="overflow-y-auto max-h-96">     
      <div v-if="isLoading && newsItems.length === 0" class="text-center py-4 text-gray-400">       
        Cargando noticias...     
      </div>          
      <div v-else-if="newsItems.length === 0" class="text-center py-4 text-gray-400">       
        No hay noticias disponibles.     
      </div>          
      <div v-else v-for="item in newsItems" :key="item._id" class="bg-gray-200 p-3 mb-4 rounded">       
        <div class="flex">         
          <div class="mr-3">           
            <div class="border border-black p-1 w-12 h-12 flex flex-col items-center justify-center">             
              <span class="text-xs font-bold text-black">NEWS</span>             
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">               
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />             
              </svg>           
            </div>         
          </div>         
          <div class="flex-1">           
            <h3 class="text-black font-medium text-sm">{{ item.title }}</h3>           
            <p class="text-xs text-gray-600">{{ item.content }}</p>           
            <p v-if="item.createdAt" class="text-xs text-gray-500 mt-1">{{ formatDate(item.createdAt) }}</p>           
            <div class="flex justify-end mt-2">             
              <button               
                @click="deleteNews(item._id)"               
                class="text-xs text-red-600 hover:text-red-800"             
              >               
                Eliminar             
              </button>           
            </div>         
          </div>       
        </div>     
      </div>   
    </div>    

    <!-- Default news examples (fallback) -->
    <div v-if="newsItems.length === 0" class="mt-4">
      <!-- Noticia 1 -->
      <div class="bg-gray-200 p-3 mb-4 rounded">
        <div class="flex">
          <div class="mr-3">
            <div class="border border-black p-1 w-12 h-12 flex flex-col items-center justify-center">
              <span class="text-xs font-bold text-black">NEWS</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          </div>
          <div>
            <h3 class="text-black font-medium text-sm">Evento Terraza</h3>
            <div class="h-px bg-gray-400 my-1"></div>
            <div class="h-px bg-gray-400 my-1"></div>
          </div>
        </div>
      </div>
      
      <!-- Noticia 2 -->
      <div class="bg-gray-200 p-3 mb-4 rounded">
        <div class="flex">
          <div class="mr-3">
            <div class="border border-black p-1 w-12 h-12 flex flex-col items-center justify-center">
              <span class="text-xs font-bold text-black">NEWS</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          </div>
          <div>
            <h3 class="text-black font-medium text-sm">Película Auditorio</h3>
            <div class="h-px bg-gray-400 my-1"></div>
            <div class="h-px bg-gray-400 my-1"></div>
          </div>
        </div>
      </div>
      
      <!-- Noticia 3 -->
      <div class="bg-gray-200 p-3 rounded">
        <div class="flex">
          <div class="mr-3">
            <div class="border border-black p-1 w-12 h-12 flex flex-col items-center justify-center">
              <span class="text-xs font-bold text-black">NEWS</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          </div>
          <div>
            <h3 class="text-black font-medium text-sm">Emprendimiento</h3>
            <div class="h-px bg-gray-400 my-1"></div>
            <div class="h-px bg-gray-400 my-1"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification component -->   
    <Teleport to="body">     
      <div       
        v-if="showNotification"       
        class="fixed bottom-4 right-4 p-3 rounded shadow-lg text-white text-sm z-50"       
        :class="notificationType === 'success' ? 'bg-green-600' : 'bg-red-600'"     
      >       
        {{ notificationMessage }}     
      </div>   
    </Teleport>
  </div>
</template>