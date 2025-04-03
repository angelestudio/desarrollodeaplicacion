<template>
  <div class="flex flex-col md:flex-row h-screen bg-black text-white overflow-hidden">
    <!-- Sidebar izquierda - Fondo negro sólido (ahora más pequeña) -->
    <div class="w-full md:w-1/5 lg:w-1/5 bg-black flex flex-col relative border-b md:border-b-0 md:border-r border-gray-800">
      <div class="p-4 flex items-center">
        <div class="flex items-center">
          <div class="w-8 h-8 bg-transparent rounded-full flex items-center justify-center border-2 border-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" />
            </svg>
          </div>
          <span class="ml-2 font-semibold text-white">SENACLUB</span>
        </div>
      </div>

      <!-- Menú de navegación (News removido) -->
      <nav class="flex-1 mt-4 md:mt-8 px-4">
        <div class="grid grid-cols-2 md:grid-cols-1 gap-2 md:space-y-3">
          <router-link to="/" class="block py-2 px-4 md:px-6 rounded-full bg-gray-900 text-center text-white text-sm">Home</router-link>
          <router-link to="/explore" class="block py-2 px-4 md:px-6 rounded-full bg-gray-900 text-center text-white text-sm">Explore</router-link>
          <router-link to="/Profile/notifications" class="block py-2 px-4 md:px-6 rounded-full bg-indigo-800 text-center text-white text-sm">Notifications</router-link>
          <router-link to="/Profile" class="block py-2 px-4 md:px-6 rounded-full bg-indigo-800 text-center text-white text-sm">Profile</router-link>
          <router-link to="/Profile/posts" class="block py-2 px-4 md:px-6 rounded-full bg-gray-900 text-center text-white text-sm">Posts</router-link>
        </div>
      </nav>

      <!-- Perfil del usuario en sidebar - Visible solo en pantallas medianas o mayores -->
      <div class="hidden md:flex p-4 items-center mt-auto">
        <img src="https://i.pravatar.cc/300" alt="User" class="w-8 h-8 rounded-full" />
        <span class="ml-2 text-sm">Roberta Jimenez</span>
      </div>
    </div>

    <!-- Contenido principal (ahora un poco más amplio) -->
    <div class="w-full md:w-3/5 lg:w-3/5 flex flex-col bg-black relative overflow-y-auto">
      <!-- Imagen de fondo en la parte superior - patrón de líneas -->
      <div class="absolute top-0 left-0 right-0 h-36 md:h-52 z-0 overflow-hidden bg-gray-700">
        <img src="" alt="Background Pattern" class="w-full h-full object-cover" style="filter: brightness(0.5) grayscale(0.5);" />
      </div>

      <!-- Sección de perfil -->
      <div class="flex flex-col items-center pt-6 md:pt-12 relative z-10 mt-4 md:mt-8">
        <img src="https://i.pravatar.cc/300" alt="Roberta Jimenez" class="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-white" />
        <h1 class="mt-2 font-medium text-base md:text-lg text-white">Roberta Jimenez</h1>
        <p class="text-gray-400 text-xs md:text-sm">Aprendiz</p>

        <!-- Contador y botón -->
        <div class="flex space-x-4 md:space-x-6 mt-2 md:mt-3">
          <div class="px-2 md:px-3 py-1 bg-transparent border border-gray-700 rounded-full text-xs">50 Posts</div>
          <div class="px-2 md:px-3 py-1 bg-transparent border border-gray-700 rounded-full text-xs">30 Saved</div>
        </div>

        <button class="mt-2 md:mt-3 px-4 md:px-5 py-1 border border-gray-600 rounded-full text-xs text-gray-300">
          About me
        </button>

        <p class="mt-2 text-xs text-center max-w-xs px-4 text-gray-400">
          Soy aprendiz de SENA, me gusta el diseño soy lo mejor me gusta el baloncesto me gusta pintar y demás
        </p>
      </div>

      <!-- Navegación de contenido con router-link -->
      <div class="border-b border-gray-800 text-center mt-4">
        <div class="flex justify-center">
          <router-link to="/Profile/posts" class="px-4 md:px-8 py-2 text-xs md:text-sm" :class="$route.path === '/Profile/posts' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'">Posts</router-link>
          <router-link to="/Profile/notifications" class="px-4 md:px-8 py-2 text-xs md:text-sm" :class="$route.path === '/Profile/notifications' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'">Notifications</router-link>
        </div>
      </div>

      <!-- Área para renderizar las vistas (Posts o Notifications) -->
      <router-view>
        <!-- Template para la vista de Posts -->
        <template v-if="$route.path === '/Profile/posts'">
          <!-- Componente para crear un nuevo post -->
          <div class="p-4 border border-gray-800 rounded-lg mx-4 my-4">
            <div class="flex items-center mb-2">
              <img src="https://i.pravatar.cc/300" alt="User" class="w-8 h-8 rounded-full" />
              <span class="ml-2 text-sm font-medium">Crear nuevo post</span>
            </div>
            <textarea v-model="newPostContent" class="w-full bg-gray-900 text-gray-300 rounded-lg p-3 text-sm resize-none border border-gray-700 focus:outline-none focus:border-indigo-500" rows="3" placeholder="¿Qué quieres compartir?"></textarea>
            <div class="flex justify-between items-center mt-2">
              <div class="flex space-x-2">
                <button class="p-2 text-blue-500 rounded-full hover:bg-gray-800">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                  </svg>
                </button>
                <button class="p-2 text-blue-500 rounded-full hover:bg-gray-800">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
              <button @click="createPost" class="px-4 py-1 bg-indigo-600 text-white rounded-full text-sm hover:bg-indigo-700">Publicar</button>
            </div>
          </div>
          
          <!-- Lista de posts creados -->
          <div v-if="posts.length === 0" class="text-center text-gray-500 py-6">
            Tus posts aparecerán aquí
          </div>
          
          <!-- Posts creados -->
          <div v-for="(post, index) in posts" :key="index" class="p-4 border border-gray-800 rounded-lg mx-4 mb-4">
            <div class="flex items-start mb-3">
              <img src="https://i.pravatar.cc/300" alt="User" class="w-8 h-8 rounded-full" />
              <div class="ml-2">
                <p class="text-sm font-medium">Roberta Jimenez</p>
                <p class="text-xs text-gray-400">Hace un momento</p>
              </div>
            </div>
            <p class="text-sm text-gray-300">{{ post.content }}</p>
            <div class="flex space-x-4 mt-3 pt-3 border-t border-gray-800">
              <button class="flex items-center text-xs text-gray-400 hover:text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                Me gusta
              </button>
              <button class="flex items-center text-xs text-gray-400 hover:text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clip-rule="evenodd" />
                </svg>
                Comentar
              </button>
              <button class="flex items-center text-xs text-gray-400 hover:text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                Compartir
              </button>
            </div>
          </div>
        </template>
        
        <!-- Template para la vista de Notificaciones -->
        <template v-if="$route.path === '/Profile/notifications'">
          <!-- Componente para crear una nueva notificación (para admin) -->
          <div class="p-4 border border-gray-800 rounded-lg mx-4 my-4">
            <div class="flex items-center mb-2">
              <div class="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <span class="ml-2 text-sm font-medium">Crear notificación</span>
            </div>
            <input v-model="newNotification.title" type="text" class="w-full bg-gray-900 text-gray-300 rounded-lg p-3 text-sm border border-gray-700 focus:outline-none focus:border-indigo-500 mb-2" placeholder="Título de la notificación">
            <textarea v-model="newNotification.content" class="w-full bg-gray-900 text-gray-300 rounded-lg p-3 text-sm resize-none border border-gray-700 focus:outline-none focus:border-indigo-500" rows="2" placeholder="Contenido de la notificación"></textarea>
            <div class="flex justify-between items-center mt-2">
              <select v-model="newNotification.type" class="bg-gray-900 text-gray-300 rounded-lg px-3 py-1 text-sm border border-gray-700 focus:outline-none focus:border-indigo-500">
                <option value="">Selecciona el tipo</option>
                <option value="info">Información</option>
                <option value="warning">Aviso</option>
                <option value="alert">Alerta</option>
              </select>
              <button @click="createNotification" class="px-4 py-1 bg-indigo-600 text-white rounded-full text-sm hover:bg-indigo-700">Enviar</button>
            </div>
          </div>
          
          <!-- Lista de notificaciones -->
          <div v-if="notifications.length === 0" class="text-center text-gray-500 py-6">
            Tus notificaciones aparecerán aquí
          </div>
          
          <!-- Notificaciones creadas -->
          <div v-for="(notification, index) in notifications" :key="index" class="mx-4 mb-3">
            <div class="p-3 rounded-lg" :class="{
              'bg-blue-900 bg-opacity-20 border border-blue-800': notification.type === 'info',
              'bg-yellow-900 bg-opacity-20 border border-yellow-800': notification.type === 'warning',
              'bg-red-900 bg-opacity-20 border border-red-800': notification.type === 'alert',
              'bg-gray-800': !notification.type
            }">
              <div class="flex">
                <div class="mr-3">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center" :class="{
                    'bg-blue-500': notification.type === 'info',
                    'bg-yellow-500': notification.type === 'warning',
                    'bg-red-500': notification.type === 'alert',
                    'bg-gray-500': !notification.type
                  }">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 class="text-sm font-medium">{{ notification.title }}</h3>
                  <p class="text-xs text-gray-400 mt-1">{{ notification.content }}</p>
                  <div class="flex justify-between items-center mt-2">
                    <span class="text-xs text-gray-500">Hace un momento</span>
                    <button class="text-xs text-gray-400 hover:text-white">Marcar como leída</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </router-view>
    </div>

    <!-- Sidebar derecha - Noticias (ahora con scroll explícito) -->
    <div class="hidden md:block w-full md:w-1/5 lg:w-1/5 bg-black border-l border-gray-800 flex flex-col">
      <!-- Barra de búsqueda -->
      <div class="p-3 border-b border-gray-800">
        <div class="bg-gray-900 rounded-full px-4 py-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
          </svg>
          <input type="text" placeholder="Search" class="bg-transparent border-none w-full ml-2 text-sm focus:outline-none text-gray-300">
        </div>
      </div>
      
      <!-- Componente para crear una nueva noticia -->
      <div class="p-3 border-b border-gray-800">
        <div class="p-3 border border-gray-700 rounded-lg bg-gray-900">
          <div class="flex items-center mb-2">
            <div class="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <span class="ml-2 text-xs font-medium">Nueva noticia</span>
          </div>
          <input v-model="newNews.title" type="text" class="w-full bg-gray-800 text-gray-300 rounded-lg p-2 text-xs border border-gray-700 focus:outline-none focus:border-indigo-500 mb-2" placeholder="Título de la noticia">
          <textarea v-model="newNews.content" class="w-full bg-gray-800 text-gray-300 rounded-lg p-2 text-xs resize-none border border-gray-700 focus:outline-none focus:border-indigo-500" rows="2" placeholder="Contenido breve"></textarea>
          <div class="flex justify-end mt-2">
            <button @click="createNews" class="px-3 py-1 bg-indigo-600 text-white rounded-full text-xs hover:bg-indigo-700">Publicar</button>
          </div>
        </div>
      </div>
      
      <!-- Contenedor de noticias con scroll explícito -->
      <div class="flex-1 overflow-y-auto h-full">
        <div class="p-4 border border-gray-700 rounded-lg m-4">
          <!-- Encabezado NEWS -->
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-indigo-500 font-bold">NEWS</h2>
            <div class="grid grid-cols-3 gap-1">
              <div class="h-1 w-1 bg-indigo-500 rounded-full"></div>
              <div class="h-1 w-1 bg-indigo-500 rounded-full"></div>
              <div class="h-1 w-1 bg-indigo-500 rounded-full"></div>
              <div class="h-1 w-1 bg-indigo-500 rounded-full"></div>
              <div class="h-1 w-1 bg-indigo-500 rounded-full"></div>
              <div class="h-1 w-1 bg-indigo-500 rounded-full"></div>
              <div class="h-1 w-1 bg-indigo-500 rounded-full"></div>
              <div class="h-1 w-1 bg-indigo-500 rounded-full"></div>
              <div class="h-1 w-1 bg-indigo-500 rounded-full"></div>
            </div>
          </div>
          
          <p class="text-sm text-gray-400 mb-4">noticias csf</p>
          <hr class="border-gray-700 mb-4">
          
          <!-- Noticias creadas -->
          <div v-for="(news, index) in newsList" :key="index" class="bg-gray-200 p-3 mb-4 rounded">
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
                <h3 class="text-black font-medium text-sm">{{ news.title }}</h3>
                <p class="text-xs text-gray-600">{{ news.content }}</p>
              </div>
            </div>
          </div>
          
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Estado para Posts
const newPostContent = ref('');
const posts = ref<Array<{content: string}>>([]);

const createPost = () => {
  if (newPostContent.value.trim()) {
    posts.value.unshift({
      content: newPostContent.value
    });
    newPostContent.value = '';
  }
};

// Estado para Notificaciones
const newNotification = ref({
  title: '',
  content: '',
  type: ''
});
const notifications = ref<Array<{title: string, content: string, type: string}>>([]);

const createNotification = () => {
  if (newNotification.value.title.trim() && newNotification.value.content.trim()) {
    notifications.value.unshift({
      title: newNotification.value.title,
      content: newNotification.value.content,
      type: newNotification.value.type || 'info'
    });
    // Reset form
    newNotification.value = {
      title: '',
      content: '',
      type: ''
    };
  }
};

// Estado para Noticias
const newNews = ref({
  title: '',
  content: ''
});
const newsList = ref<Array<{title: string, content: string}>>([]);

const createNews = () => {
  if (newNews.value.title.trim() && newNews.value.content.trim()) {
    newsList.value.unshift({
      title: newNews.value.title,
      content: newNews.value.content
    });
    // Reset form
    newNews.value = {
      title: '',
      content: ''
    };
  }
};
</script>






