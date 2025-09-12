<template>   
  <div class="min-h-screen flex flex-col overflow-x-hidden" :class="theme === 'light' ? 'bg-gray-50 text-gray-900' : 'bg-black text-gray-100'">     
    
    <!-- NAVBAR CON ANIMACIÓN -->     
    <nav class="flex justify-between items-center px-12 py-6 backdrop-blur-md shadow-lg border-b sticky top-0 z-50 transition-all duration-300" :class="theme === 'light' ? 'bg-white/90 border-gray-200' : 'bg-black/90 border-gray-800'">       
      <div class="flex items-center space-x-4">
        <!-- Logo del SENA -->
        <img 
          src="@/assets/logo-del-sena-01.png" 
          alt="Logo SENA" 
          class="h-16 w-auto hover:scale-105 transition-transform duration-300"
        />
        <div class="text-3xl font-black hover:text-[#3B9D30] transition-colors cursor-pointer" :class="theme === 'light' ? 'text-gray-800' : 'text-gray-100'">
          SENA<span class="text-[#3B9D30]">CLUB</span>
        </div>
      </div>       
      <div class="flex space-x-8">         
        <a href="#" class="hover:text-[#3B9D30] font-semibold text-lg transition-all duration-300 hover:scale-105" :class="theme === 'light' ? 'text-gray-700' : 'text-gray-300'">Centro de Servicios Financieros - Chapinero</a>       
      </div>       
      <div class="flex space-x-6 items-center">
        <!-- Botón de tema día/noche -->
        <button 
          @click="themeStore.toggleTheme()"
          class="hover:text-[#39A900] focus:outline-none text-2xl transition-all duration-300 hover:scale-110"
        >
          {{ theme === 'light' ? '🌙' : '☀️' }}
        </button>         
        <RouterLink to="/signin" class="hover:text-[#3B9D30] font-semibold text-lg transition-all duration-300 hover:scale-105" :class="theme === 'light' ? 'text-gray-700' : 'text-gray-300'">Ingresar</RouterLink>         
        <RouterLink           
          to="/signup"           
          class="bg-gradient-to-r from-[#3B9D30] to-[#2E7D2E] text-white px-8 py-3 rounded-lg text-lg font-bold shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl relative overflow-hidden group"         
        >
          <span class="relative z-10">Registrarse</span>
          <div class="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>         
        </RouterLink>       
      </div>     
    </nav>      
    
    <!-- MAIN CONTENT CON PARTÍCULAS ANIMADAS -->     
    <main class="flex flex-1 justify-center items-center p-16 flex-wrap gap-20 text-center relative" :class="theme === 'light' ? 'bg-gradient-to-br from-gray-50 to-gray-100' : 'bg-gradient-to-br from-black to-black'">
      <!-- Partículas flotantes -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="particle particle-1"></div>
        <div class="particle particle-2"></div>
        <div class="particle particle-3"></div>
        <div class="particle particle-4"></div>
        <div class="particle particle-5"></div>
      </div>
      
      <div class="max-w-2xl z-10 relative">         
        <div class="backdrop-blur-sm border rounded-full px-6 py-2 mb-6 inline-block" :class="theme === 'light' ? 'bg-[#3B9D30]/10 border-[#3B9D30]/30' : 'bg-[#3B9D30]/20 border-[#3B9D30]/40'">
          <p class="text-lg text-[#3B9D30] font-bold animate-pulse">           
            ¡Únete a la comunidad del Centro de Servicios Financieros!         
          </p>
        </div>         
        <h1 class="text-6xl font-black mb-8 leading-tight animate-fade-in-up" :class="theme === 'light' ? 'text-gray-800' : 'text-gray-100'">
          ¡Bienvenidos a <span class="text-[#3B9D30] bg-gradient-to-r from-[#3B9D30] to-[#2E7D2E] bg-clip-text text-transparent animate-gradient">SenaClub</span>!
        </h1>         
        <p class="text-xl mb-10 leading-relaxed font-medium animate-fade-in-up animation-delay-300" :class="theme === 'light' ? 'text-gray-600' : 'text-gray-300'">           
          El sitio online oficial para clubs dentro del Centro de Servicios Financieros SENA Chapinero.
          Conecta con tus compañeros, participa en actividades extracurriculares y enriquece tu formación técnica y tecnológica.         
        </p>         
        <RouterLink 
          to="/clubs" 
          class="inline-flex items-center gap-3 bg-gradient-to-r from-[#3B9D30] to-[#2E7D2E] text-white px-10 py-4 rounded-xl text-xl font-bold shadow-2xl transition-all duration-500 transform hover:scale-110 hover:shadow-green-500/25 group animate-bounce-gentle"
        >           
          <span>Explorar Clubes</span>
          <svg class="w-6 h-6 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
          </svg>      
        </RouterLink>       
      </div>        
      
      <!-- IMAGEN CON EFECTOS -->       
      <div class="max-w-lg animate-float z-10 relative">
        <div class="absolute -inset-4 bg-gradient-to-r from-[#3B9D30] to-[#2E7D2E] rounded-3xl blur opacity-20 animate-pulse"></div>         
        <div class="relative bg-gradient-to-br from-[#3B9D30] to-[#2E7D2E] p-1 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:rotate-2">
          <img           
            src="@/assets/inicio.png.jpeg"           
            alt="Centro de Servicios Financieros SENA Chapinero"           
            class="w-full rounded-3xl transform transition-all duration-500 hover:scale-105"         
          />
        </div>       
      </div>     
    </main>      
    
    <!-- ESTADÍSTICAS ANIMADAS -->
    <section class="py-12 border-y transition-colors duration-300" :class="theme === 'light' ? 'bg-white border-gray-200' : 'bg-black border-gray-800'">
      <div class="max-w-6xl mx-auto px-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div class="group cursor-pointer">
            <div class="text-4xl font-black text-[#3B9D30] mb-2 transition-all group-hover:scale-110">+ Comunicación</div>
            <p class="font-semibold" :class="theme === 'light' ? 'text-gray-600' : 'text-gray-400'">Toda la comunidad conectada en un mismo lugar</p>
          </div>
          <div class="group cursor-pointer">
            <div class="text-4xl font-black text-[#3B9D30] mb-2 transition-all group-hover:scale-110">+ Colaboración</div>
            <p class="font-semibold" :class="theme === 'light' ? 'text-gray-600' : 'text-gray-400'">Aprendices unidos en clubs y actividades</p>
          </div>
          <div class="group cursor-pointer">
            <div class="text-4xl font-black text-[#3B9D30] mb-2 transition-all group-hover:scale-110">+ Información</div>
            <p class="font-semibold" :class="theme === 'light' ? 'text-gray-600' : 'text-gray-400'">Noticias y eventos al día del CSF Chapinero</p>
          </div>
          <div class="group cursor-pointer">
            <div class="text-4xl font-black text-[#3B9D30] mb-2 transition-all group-hover:scale-110">+ Interacción Estudiantil</div>
            <p class="font-semibold" :class="theme === 'light' ? 'text-gray-600' : 'text-gray-400'">Mayor participación y vínculos entre aprendices e instructores</p>
          </div>
        </div>
      </div>
    </section>

    

    <!-- SECCIÓN DE ÚLTIMAS NOTICIAS -->
    <section class="py-20 relative overflow-hidden transition-colors duration-300" :class="theme === 'light' ? 'bg-gradient-to-b from-white to-gray-50' : 'bg-gradient-to-b from-black to-black'">
      <div class="max-w-7xl mx-auto px-12 relative z-10">
        <div class="text-center mb-16">
          <div class="flex justify-between items-center mb-8">
            <div class="flex-1">
              <h2 class="text-5xl font-black mb-6 animate-fade-in-up" :class="theme === 'light' ? 'text-gray-800' : 'text-gray-100'">
                Noticias del <span class="text-[#3B9D30]">Centro</span>
                <span v-if="newsItems.length > 0" class="text-sm font-normal ml-2" :class="theme === 'light' ? 'text-gray-500' : 'text-gray-400'">
                  ({{ newsItems.length }} {{ newsItems.length === 1 ? 'noticia' : 'noticias' }})
                </span>
              </h2>
              <div class="w-24 h-1 bg-gradient-to-r from-[#3B9D30] to-[#2E7D2E] mx-auto mb-6"></div>
              <p class="text-xl max-w-3xl mx-auto" :class="theme === 'light' ? 'text-gray-600' : 'text-gray-300'">
                Mantente informado sobre actividades, eventos y novedades del Centro de Servicios Financieros Chapinero
              </p>
            </div>
            
            <button 
              @click="fetchNews"
              :disabled="isLoadingNews"
              class="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ml-8"
              :class="[
                theme === 'light' 
                  ? 'bg-green-100 border-green-300 text-green-700 hover:bg-green-200' 
                  : 'bg-black border-green-700 text-green-300 hover:bg-gray-900',
                isLoadingNews ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              ]"
            >
              <svg 
                class="w-4 h-4 transition-transform"
                :class="{ 'animate-spin': isLoadingNews }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {{ isLoadingNews ? 'Actualizando...' : 'Actualizar' }}
            </button>
          </div>
        </div>

        <!-- Loading state -->
        <div v-if="isLoadingNews && newsItems.length === 0" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
          <p class="text-lg" :class="theme === 'light' ? 'text-gray-600' : 'text-gray-400'">Cargando noticias del centro...</p>
        </div>

        <!-- No news state -->
        <div v-else-if="newsItems.length === 0" class="text-center py-12">
          <div class="text-6xl mb-4">📰</div>
          <p class="text-lg mb-2" :class="theme === 'light' ? 'text-gray-600' : 'text-gray-400'">No hay noticias disponibles en este momento.</p>
          <p class="text-sm" :class="theme === 'light' ? 'text-gray-500' : 'text-gray-500'">¡Vuelve pronto para conocer las últimas novedades del centro!</p>
        </div>

        <!-- News grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <article 
            v-for="news in newsItems.slice(0, 6)" 
            :key="news._id"
            class="group rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border overflow-hidden"
            :class="[
              theme === 'light' 
                ? 'bg-white border-gray-100 hover:border-[#3B9D30]/30' 
                : 'bg-black border-gray-800 hover:border-[#3B9D30]/30'
            ]"
          >
            <!-- Indicador de noticia nueva -->
            <div 
              v-if="isRecentNews(news.createdAt)"
              class="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg animate-pulse z-10"
            >
              ¡NUEVO!
            </div>
            
            <!-- News header with author info -->
            <div class="p-6 pb-4">
              <div class="flex items-center space-x-3 mb-4">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#3B9D30] to-[#2E7D2E] flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {{ getAuthorInitials(news.author || '') }}
                </div>
                <div>
                  <p class="font-semibold text-sm" :class="theme === 'light' ? 'text-gray-800' : 'text-gray-200'">
                    {{ getAuthorName(news.author || '') }}
                  </p>
                  <div class="flex items-center space-x-2">
                    <span class="text-xs px-2 py-1 rounded-full bg-[#3B9D30]/10 text-[#3B9D30] font-medium">
                      Centro SF Chapinero
                    </span>
                    <span v-if="news.createdAt" class="text-xs" :class="theme === 'light' ? 'text-gray-500' : 'text-gray-400'">
                      {{ formatDate(news.createdAt) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- News title -->
              <h3 class="text-xl font-bold mb-3 group-hover:text-[#3B9D30] transition-colors leading-tight line-clamp-2" :class="theme === 'light' ? 'text-gray-800' : 'text-gray-200'">
                {{ news.title }}
              </h3>

              <!-- News content -->
              <p class="text-sm leading-relaxed line-clamp-3" :class="theme === 'light' ? 'text-gray-600' : 'text-gray-400'">
                {{ news.content }}
              </p>
            </div>

            <!-- News footer -->
            <div class="px-6 pb-6">
              <div class="flex justify-between items-center pt-4 border-t" :class="theme === 'light' ? 'border-gray-100' : 'border-gray-800'">
                <button class="text-[#3B9D30] font-semibold text-sm hover:underline transition-colors">
                  Leer más →
                </button>
                <div v-if="news.updatedAt && news.updatedAt !== news.createdAt" class="text-xs" :class="theme === 'light' ? 'text-gray-400' : 'text-gray-500'">
                  ✏️ Actualizado
                </div>
              </div>
            </div>
          </article>
        </div>

        <!-- Ver más noticias button -->
        <div v-if="newsItems.length > 6" class="text-center mt-12">
          <RouterLink 
            to="/news"
            class="inline-flex items-center gap-3 bg-gradient-to-r from-[#3B9D30] to-[#2E7D2E] text-white px-8 py-4 rounded-xl text-lg font-bold shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-green-500/25 group"
          >
            <span>Ver todas las noticias</span>
            <svg class="w-5 h-5 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
          </RouterLink>
        </div>
      </div>
    </section>
    
    <!-- SECCIÓN CLUBES CON ANIMACIONES AVANZADAS -->     
  <section
    class="px-12 py-20 relative overflow-hidden transition-colors duration-300"
    :class="theme === 'light' ? 'bg-gradient-to-b from-gray-50 to-white' : 'bg-gradient-to-b from-black to-black'"
  >
    <!-- Patrón de fondo -->
    <div class="absolute inset-0 bg-pattern opacity-5"></div>
    
    <div class="max-w-7xl mx-auto relative z-10">
      <div class="text-center mb-16">
        <h2
          class="text-5xl font-black mb-6 animate-fade-in-up"
          :class="theme === 'light' ? 'text-gray-800' : 'text-gray-100'"
        >
          Nuestros <span class="text-[#3B9D30]">Clubes</span> Especializados
        </h2>
        <div class="w-24 h-1 bg-gradient-to-r from-[#3B9D30] to-[#2E7D2E] mx-auto mb-6"></div>
        <p
          class="text-xl max-w-3xl mx-auto"
          :class="theme === 'light' ? 'text-gray-600' : 'text-gray-300'"
        >
          Actividades extracurriculares diseñadas para complementar tu formación en servicios financieros y fortalecer tu perfil profesional
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Tarjeta Finanzas -->
        <div
          class="group border-2 p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 hover:border-[#3B9D30] relative overflow-hidden"
          :class="theme === 'light' ? 'bg-white border-gray-200' : 'bg-black border-gray-800'"
        >
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#3B9D30] to-[#2E7D2E] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>         
          <div
            class="w-20 h-20 bg-gradient-to-br from-[#3B9D30] to-[#2E7D2E] rounded-2xl flex items-center justify-center mb-8 group-hover:rotate-12 transition-all duration-500 mx-auto shadow-xl"
          >
            <span class="text-white text-3xl font-bold">💰</span>
          </div>
          <h3
            class="text-3xl font-black mb-6 text-center group-hover:text-[#3B9D30] transition-colors"
            :class="theme === 'light' ? 'text-gray-800' : 'text-gray-200'"
          >
            Finanzas
          </h3>
          <p
            class="leading-relaxed text-lg text-center mb-6"
            :class="theme === 'light' ? 'text-gray-600' : 'text-gray-400'"
          >
            Club de Banca y Finanzas, Seguros, Gestión Contable, Análisis de Crédito y Educación Financiera.
          </p>
          
          <!-- Texto adicional -->
          <transition name="fade">
            <div
              v-if="showFinanzas"
              class="text-center text-base mb-4"
              :class="theme === 'light' ? 'text-gray-500' : 'text-gray-400'"
            >
              Aquí los aprendices trabajan en proyectos prácticos, como simulación de créditos, casos de contabilidad y estrategias de inversión.
            </div>
          </transition>
          
          <div class="text-center">
            <button
              class="text-[#3B9D30] font-bold hover:underline"
              @click="showFinanzas = !showFinanzas"
            >
              {{ showFinanzas ? 'Ver menos ↑' : 'Ver más →' }}
            </button>
          </div>
        </div>
        
        <!-- Tarjeta Tecnología -->
        <div
          class="group border-2 p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 hover:border-[#3B9D30] relative overflow-hidden"
          :class="theme === 'light' ? 'bg-white border-gray-200' : 'bg-black border-gray-800'"
        >
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#3B9D30] to-[#2E7D2E] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>         
          <div
            class="w-20 h-20 bg-gradient-to-br from-[#3B9D30] to-[#2E7D2E] rounded-2xl flex items-center justify-center mb-8 group-hover:rotate-12 transition-all duration-500 mx-auto shadow-xl"
          >
            <span class="text-white text-3xl font-bold">💻</span>
          </div>
          <h3
            class="text-3xl font-black mb-6 text-center group-hover:text-[#3B9D30] transition-colors"
            :class="theme === 'light' ? 'text-gray-800' : 'text-gray-200'"
          >
            Tecnología
          </h3>
          <p
            class="leading-relaxed text-lg text-center mb-6"
            :class="theme === 'light' ? 'text-gray-600' : 'text-gray-400'"
          >
            Desarrollo de Software, Ciberseguridad, Análisis de Datos, Innovación Tecnológica.
          </p>
          
          <!-- Texto adicional -->
          <transition name="fade">
            <div
              v-if="showTecnologia"
              class="text-center text-base mb-4"
              :class="theme === 'light' ? 'text-gray-500' : 'text-gray-400'"
            >
              Espacio para aprender nuevas tecnologías, participar en hackatones y aplicar soluciones digitales a retos financieros reales.
            </div>
          </transition>
          
          <div class="text-center">
            <button
              class="text-[#3B9D30] font-bold hover:underline"
              @click="showTecnologia = !showTecnologia"
            >
              {{ showTecnologia ? 'Ver menos ↑' : 'Ver más →' }}
            </button>
          </div>
        </div>
        
        <!-- Tarjeta Liderazgo -->
        <div
          class="group border-2 p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 hover:border-[#3B9D30] relative overflow-hidden"
          :class="theme === 'light' ? 'bg-white border-gray-200' : 'bg-black border-gray-800'"
        >
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#3B9D30] to-[#2E7D2E] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>         
          <div
            class="w-20 h-20 bg-gradient-to-br from-[#3B9D30] to-[#2E7D2E] rounded-2xl flex items-center justify-center mb-8 group-hover:rotate-12 transition-all duration-500 mx-auto shadow-xl"
          >
            <span class="text-white text-3xl font-bold">🎯</span>
          </div>
          <h3
            class="text-3xl font-black mb-6 text-center group-hover:text-[#3B9D30] transition-colors"
            :class="theme === 'light' ? 'text-gray-800' : 'text-gray-200'"
          >
            Liderazgo
          </h3>
          <p
            class="leading-relaxed text-lg text-center mb-6"
            :class="theme === 'light' ? 'text-gray-600' : 'text-gray-400'"
          >
            Emprendimiento, Liderazgo Juvenil, Servicio al Cliente, Comunicación Asertiva y Proyección Social.
          </p>
          
          <!-- Texto adicional -->
          <transition name="fade">
            <div
              v-if="showLiderazgo"
              class="text-center text-base mb-4"
              :class="theme === 'light' ? 'text-gray-500' : 'text-gray-400'"
            >
              Los participantes desarrollan habilidades blandas, organizan eventos y fortalecen el liderazgo juvenil en el CSF Chapinero.
            </div>
          </transition>
          
          <div class="text-center">
            <button
              class="text-[#3B9D30] font-bold hover:underline"
              @click="showLiderazgo = !showLiderazgo"
            >
              {{ showLiderazgo ? 'Ver menos ↑' : 'Ver más →' }}
            </button>
          </div>
        </div>
      </div>
    </div>     
  </section>


    <!-- TESTIMONIOS -->
    <section class="py-20 bg-[#3B9D30] text-white relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-[#3B9D30] to-[#2E7D2E]"></div>
      <div class="max-w-4xl mx-auto px-12 text-center relative z-10">
        <h2 class="text-4xl font-black mb-12">Testimonios de Nuestros Aprendices</h2>
        <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <p class="text-xl italic mb-6">"Los clubes del Centro de Servicios Financieros me permitieron aplicar lo aprendido en clase y desarrollar habilidades de liderazgo. Ahora trabajo en un banco gracias a las competencias que adquirí."</p>
          <div class="flex items-center justify-center gap-4">
            <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <span class="text-2xl">👩‍💼</span>
            </div>
            <div>
              <p class="font-bold">María Fernanda Rodríguez</p>
              <p class="text-white/80">Técnica en Operaciones Bancarias - Egresada 2024</p>
            </div>
          </div>
        </div>
      </div>
    </section>      
    
    <!-- FOOTER MEJORADO -->     
    <footer class="relative overflow-hidden transition-colors duration-300" :class="theme === 'light' ? 'bg-gray-900 text-white' : 'bg-black text-gray-300'">
      <div class="absolute inset-0" :class="theme === 'light' ? 'bg-gradient-to-br from-gray-900 to-black' : 'bg-gradient-to-br from-gray-950 via-black to-gray-900'"></div>
      <div class="max-w-6xl mx-auto px-12 py-16 relative z-10">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div class="text-3xl font-black mb-4">SENA<span class="text-[#3B9D30]">CLUB</span></div>
            <p class="mb-6" :class="theme === 'light' ? 'text-gray-300' : 'text-gray-400'">Centro de Servicios Financieros SENA Chapinero. Formando profesionales integrales para el sector financiero colombiano.</p>
            <div class="flex space-x-4">
              <div class="w-10 h-10 bg-[#3B9D30] rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
                <span class="text-white font-bold">f</span>
              </div>
              <div class="w-10 h-10 bg-[#3B9D30] rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
                <span class="text-white font-bold">I</span>
              </div>
              <div class="w-10 h-10 bg-[#3B9D30] rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
                <span class="text-white font-bold">Y</span>
              </div>
            </div>
          </div>
          <div>
            <h3 class="text-xl font-bold mb-4">Enlaces Rápidos</h3>
            <div class="space-y-2">
              <a href="#" class="block hover:text-[#3B9D30] transition-colors" :class="theme === 'light' ? 'text-gray-300' : 'text-gray-400'">Sobre el Centro</a>
              <a href="#" class="block hover:text-[#3B9D30] transition-colors" :class="theme === 'light' ? 'text-gray-300' : 'text-gray-400'">Clubes Estudiantiles</a>
              <a href="#" class="block hover:text-[#3B9D30] transition-colors" :class="theme === 'light' ? 'text-gray-300' : 'text-gray-400'">Programas de Formación</a>
              <a href="#" class="block hover:text-[#3B9D30] transition-colors" :class="theme === 'light' ? 'text-gray-300' : 'text-gray-400'">Bienestar Estudiantil</a>
            </div>
          </div>
          <div>
            <h3 class="text-xl font-bold mb-4">Contáctanos</h3>
            <div class="space-y-2" :class="theme === 'light' ? 'text-gray-300' : 'text-gray-400'">
              <p>📧 chapinero@sena.edu.co</p>
              <p>📱 (601) 546 1500</p>
              <p>📍 Carrera 13 No. 32-76, Chapinero, Bogotá D.C.</p>
              <p>🌐 Centro de Servicios Financieros</p>
            </div>
          </div>
        </div>
        <div class="border-t pt-8 text-center" :class="theme === 'light' ? 'border-gray-700' : 'border-gray-600'">
          <p :class="theme === 'light' ? 'text-gray-400' : 'text-gray-500'">© 2025 SenaClub - Centro de Servicios Financieros SENA Chapinero. Todos los derechos reservados.</p>
        </div>
      </div>     
    </footer>   
  </div> 
</template>  

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { storeToRefs } from 'pinia'

const themeStore = useThemeStore()
const { theme } = storeToRefs(themeStore)

// Controladores para cada club
const showFinanzas = ref(false);
const showTecnologia = ref(false);
const showLiderazgo = ref(false);

// News data
const newsItems = ref([])
const isLoadingNews = ref(false)
const notifications = ref([])
const refreshInterval = ref(null)

const API_URL = 'http://localhost:3000/news'

onMounted(async () => {
  // ------------------ NOTIFICACIONES ------------------
  const rawNotifications = localStorage.getItem('persistent_notifications')
  let persistedNotifications = []
  try {
    persistedNotifications = rawNotifications ? JSON.parse(rawNotifications) : []
  } catch {
    persistedNotifications = []
  }
  notifications.value = persistedNotifications

  // ------------------ NOTICIAS desde API ------------------
  await fetchNews()
  
  // Iniciar auto-refresh cada 60 segundos (1 minuto)
  startAutoRefresh()
})

onUnmounted(() => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value)
  }
})

const fetchNews = async () => {
  try {
    isLoadingNews.value = true
    
    // Hacer llamada a la API con timestamp para evitar caché
    const response = await fetch(`${API_URL}?timestamp=${Date.now()}`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Ordenar las noticias por fecha de creación (más recientes primero)
    const sortedData = data.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime()
      const dateB = new Date(b.createdAt || 0).getTime()
      return dateB - dateA // Orden descendente (más recientes primero)
    })
    
    newsItems.value = sortedData
    
    // También guardar en localStorage como respaldo
    localStorage.setItem('persistent_news', JSON.stringify(sortedData))
    
    console.log('Noticias cargadas desde API (ordenadas por fecha):', sortedData)
    
  } catch (error) {
    console.error('Error al obtener noticias desde API:', error)
    
    // Como fallback, intentar cargar desde localStorage
    const rawNews = localStorage.getItem('persistent_news')
    try {
      const persistedNews = rawNews ? JSON.parse(rawNews) : []
      // También ordenar las noticias del localStorage por si acaso
      const sortedPersistedNews = persistedNews.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime()
        const dateB = new Date(b.createdAt || 0).getTime()
        return dateB - dateA
      })
      newsItems.value = sortedPersistedNews
      console.log('Cargadas noticias desde localStorage como fallback (ordenadas)')
    } catch {
      newsItems.value = []
      console.log('No se pudieron cargar noticias')
    }
  } finally {
    isLoadingNews.value = false
  }
}

const startAutoRefresh = () => {
  // Auto-refresh cada 60 segundos
  refreshInterval.value = setInterval(() => {
    fetchNews()
  }, 60000)
}

const formatDate = (dateString) => {
  if (!dateString) return 'Fecha desconocida'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return 'Fecha desconocida'
  }
}

const isRecentNews = (dateString) => {
  if (!dateString) return false
  
  try {
    const newsDate = new Date(dateString)
    const now = new Date()
    const diffHours = (now.getTime() - newsDate.getTime()) / (1000 * 60 * 60)
    
    // Considerar como "nuevo" si tiene menos de 24 horas
    return diffHours < 24
  } catch (error) {
    return false
  }
}

const getAuthorInitials = (author) => {
  if (!author || author === 'undefined' || author === 'null') return '??'
  const names = author.trim().split(' ')
  return names.length >= 2 ? (names[0][0] + names[1][0]).toUpperCase() : author.substring(0, 2).toUpperCase()
}

const getAuthorName = (author) => {
  if (!author || author === 'undefined' || author === 'null') return 'Coordinación Académica'
  return author
}
</script>  

<style scoped> 
@keyframes fadeIn {   
  from { opacity: 0; transform: translateY(30px); }   
  to { opacity: 1; transform: translateY(0); } 
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(2deg); }
}

@keyframes bounceGentle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

@keyframes particleFloat {
  0%, 100% { 
    transform: translateY(0px) translateX(0px) rotate(0deg); 
    opacity: 0.3;
  }
  33% { 
    transform: translateY(-30px) translateX(20px) rotate(120deg); 
    opacity: 0.6;
  }
  66% { 
    transform: translateY(-10px) translateX(-20px) rotate(240deg); 
    opacity: 0.9;
  }
}

.animate-fade-in {   
  animation: fadeIn 1.2s ease-out forwards; 
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
}

.animation-delay-300 {
  animation-delay: 0.3s;
  opacity: 0;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-bounce-gentle {
  animation: bounceGentle 2s ease-in-out infinite;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #3B9D30;
  border-radius: 50%;
  animation: particleFloat 8s linear infinite;
}

.particle-1 {
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.particle-2 {
  top: 60%;
  left: 20%;
  animation-delay: 2s;
}

.particle-3 {
  top: 80%;
  right: 30%;
  animation-delay: 4s;
}

.particle-4 {
  top: 30%;
  right: 20%;
  animation-delay: 6s;
}

.particle-5 {
  top: 70%;
  left: 70%;
  animation-delay: 1s;
}

.bg-pattern {
  background-image: radial-gradient(circle at 1px 1px, rgba(59, 157, 48, 0.3) 1px, transparent 0);
  background-size: 20px 20px;
}

.shadow-3xl {
  box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.line-clamp-3 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>