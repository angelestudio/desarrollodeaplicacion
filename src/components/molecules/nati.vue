<template>   
  <div class="min-h-screen flex flex-col bg-gray-50 text-gray-900 overflow-x-hidden">     
    
    <!-- NAVBAR CON ANIMACIÓN -->     
    <nav class="flex justify-between items-center px-12 py-6 bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200 sticky top-0 z-50 transition-all duration-300">       
      <div class="text-3xl font-black text-gray-800 hover:text-[#3B9D30] transition-colors cursor-pointer">
        SENA<span class="text-[#3B9D30]">CLUB</span>
      </div>       
      <div class="flex space-x-8">         
        <a href="#" class="hover:text-[#3B9D30] text-gray-700 font-semibold text-lg transition-all duration-300 hover:scale-105">Sena mejora tu vida</a>       
      </div>       
      <div class="flex space-x-6">         
        <RouterLink to="/signin" class="hover:text-[#3B9D30] text-gray-700 font-semibold text-lg transition-all duration-300 hover:scale-105">Sign In</RouterLink>         
        <RouterLink           
          to="/signup"           
          class="bg-gradient-to-r from-[#3B9D30] to-[#2E7D2E] text-white px-8 py-3 rounded-lg text-lg font-bold shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl relative overflow-hidden group"         
        >
          <span class="relative z-10">Sign Up</span>
          <div class="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>         
        </RouterLink>       
      </div>     
    </nav>      
    
    <!-- MAIN CONTENT CON PARTÍCULAS ANIMADAS -->     
    <main class="flex flex-1 justify-center items-center p-16 flex-wrap gap-20 text-center bg-gradient-to-br from-gray-50 to-gray-100 relative">
      <!-- Partículas flotantes -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="particle particle-1"></div>
        <div class="particle particle-2"></div>
        <div class="particle particle-3"></div>
        <div class="particle particle-4"></div>
        <div class="particle particle-5"></div>
      </div>
      
      <div class="max-w-2xl z-10 relative">         
        <div class="bg-[#3B9D30]/10 backdrop-blur-sm border border-[#3B9D30]/30 rounded-full px-6 py-2 mb-6 inline-block">
          <p class="text-lg text-[#3B9D30] font-bold animate-pulse">           
            ¡Forma parte de la comunidad SENA!         
          </p>
        </div>         
        <h1 class="text-6xl font-black text-gray-800 mb-8 leading-tight animate-fade-in-up">
          ¡Bienvenidos a <span class="text-[#3B9D30] bg-gradient-to-r from-[#3B9D30] to-[#2E7D2E] bg-clip-text text-transparent animate-gradient">SenaClub</span>!
        </h1>         
        <p class="text-xl mb-10 text-gray-600 leading-relaxed font-medium animate-fade-in-up animation-delay-300">           
          explora nuestros clubes y encuentra el ideal para ti. Desde deportes hasta tecnología y finanzas,           
          únete a una comunidad que comparte tus intereses.         
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
            alt="Imagen de Inicio"           
            class="w-full rounded-3xl transform transition-all duration-500 hover:scale-105"         
          />
        </div>       
      </div>     
    </main>      
    
    <!-- ESTADÍSTICAS ANIMADAS -->
    <section class="py-12 bg-white border-y border-gray-200">
      <div class="max-w-6xl mx-auto px-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div class="group cursor-pointer">
            <div class="text-4xl font-black text-[#3B9D30] mb-2 transition-all group-hover:scale-110">500+</div>
            <p class="text-gray-600 font-semibold">Estudiantes Activos</p>
          </div>
          <div class="group cursor-pointer">
            <div class="text-4xl font-black text-[#3B9D30] mb-2 transition-all group-hover:scale-110">25+</div>
            <p class="text-gray-600 font-semibold">Clubes Disponibles</p>
          </div>
          <div class="group cursor-pointer">
            <div class="text-4xl font-black text-[#3B9D30] mb-2 transition-all group-hover:scale-110">15</div>
            <p class="text-gray-600 font-semibold">Sedes SENA</p>
          </div>
          <div class="group cursor-pointer">
            <div class="text-4xl font-black text-[#3B9D30] mb-2 transition-all group-hover:scale-110">98%</div>
            <p class="text-gray-600 font-semibold">Satisfacción</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- SECCIÓN CLUBES CON ANIMACIONES AVANZADAS -->     
    <section class="px-12 py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <!-- Patrón de fondo -->
      <div class="absolute inset-0 bg-pattern opacity-5"></div>
      
      <div class="max-w-7xl mx-auto relative z-10">
        <div class="text-center mb-16">
          <h2 class="text-5xl font-black text-gray-800 mb-6 animate-fade-in-up">Descubre Nuestros <span class="text-[#3B9D30]">Clubes</span></h2>
          <div class="w-24 h-1 bg-gradient-to-r from-[#3B9D30] to-[#2E7D2E] mx-auto mb-6"></div>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">Encuentra tu pasión y conecta con personas que comparten tus mismos intereses</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">       
          <div class="group bg-white border-2 border-gray-200 p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 hover:border-[#3B9D30] relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#3B9D30] to-[#2E7D2E] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>         
            <div class="w-20 h-20 bg-gradient-to-br from-[#3B9D30] to-[#2E7D2E] rounded-2xl flex items-center justify-center mb-8 group-hover:rotate-12 transition-all duration-500 mx-auto shadow-xl">
              <span class="text-white text-3xl font-bold">🏃</span>
            </div>
            <h3 class="text-3xl font-black text-gray-800 mb-6 text-center group-hover:text-[#3B9D30] transition-colors">Deportes</h3>         
            <p class="text-gray-600 leading-relaxed text-lg text-center mb-6">Únete a clubes deportivos y mantente activo mientras haces nuevos amigos y desarrollas tu potencial físico.</p>
            <div class="text-center opacity-0 group-hover:opacity-100 transition-all duration-500">
              <button class="text-[#3B9D30] font-bold hover:underline">Ver más →</button>
            </div>       
          </div>       
          
          <div class="group bg-white border-2 border-gray-200 p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 hover:border-[#3B9D30] relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#3B9D30] to-[#2E7D2E] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>         
            <div class="w-20 h-20 bg-gradient-to-br from-[#3B9D30] to-[#2E7D2E] rounded-2xl flex items-center justify-center mb-8 group-hover:rotate-12 transition-all duration-500 mx-auto shadow-xl">
              <span class="text-white text-3xl font-bold">💻</span>
            </div>
            <h3 class="text-3xl font-black text-gray-800 mb-6 text-center group-hover:text-[#3B9D30] transition-colors">Tecnología</h3>         
            <p class="text-gray-600 leading-relaxed text-lg text-center mb-6">Explora clubes de robótica, programación, inteligencia artificial y las últimas tendencias tecnológicas.</p>
            <div class="text-center opacity-0 group-hover:opacity-100 transition-all duration-500">
              <button class="text-[#3B9D30] font-bold hover:underline">Ver más →</button>
            </div>       
          </div>       
          
          <div class="group bg-white border-2 border-gray-200 p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 hover:border-[#3B9D30] relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#3B9D30] to-[#2E7D2E] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>         
            <div class="w-20 h-20 bg-gradient-to-br from-[#3B9D30] to-[#2E7D2E] rounded-2xl flex items-center justify-center mb-8 group-hover:rotate-12 transition-all duration-500 mx-auto shadow-xl">
              <span class="text-white text-3xl font-bold">💰</span>
            </div>
            <h3 class="text-3xl font-black text-gray-800 mb-6 text-center group-hover:text-[#3B9D30] transition-colors">Finanzas</h3>         
            <p class="text-gray-600 leading-relaxed text-lg text-center mb-6">Aprende sobre ahorro, inversión, emprendimiento y desarrollo financiero con otros aprendices ambiciosos.</p>
            <div class="text-center opacity-0 group-hover:opacity-100 transition-all duration-500">
              <button class="text-[#3B9D30] font-bold hover:underline">Ver más →</button>
            </div>       
          </div>
        </div>
      </div>     
    </section>

    <!-- TESTIMONIOS -->
    <section class="py-20 bg-[#3B9D30] text-white relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-[#3B9D30] to-[#2E7D2E]"></div>
      <div class="max-w-4xl mx-auto px-12 text-center relative z-10">
        <h2 class="text-4xl font-black mb-12">Lo que dicen nuestros estudiantes</h2>
        <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <p class="text-xl italic mb-6">"SenaClub cambió completamente mi experiencia universitaria. Encontré mi pasión por la tecnología y hice amigos increíbles."</p>
          <div class="flex items-center justify-center gap-4">
            <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <span class="text-2xl">👨‍🎓</span>
            </div>
            <div>
              <p class="font-bold">Carlos Mendoza</p>
              <p class="text-white/80">Estudiante de Sistemas</p>
            </div>
          </div>
        </div>
      </div>
    </section>      
    
    <!-- FOOTER MEJORADO -->     
    <footer class="bg-gray-900 text-white relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-gray-900 to-black"></div>
      <div class="max-w-6xl mx-auto px-12 py-16 relative z-10">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div class="text-3xl font-black mb-4">SENA<span class="text-[#3B9D30]">CLUB</span></div>
            <p class="text-gray-300 mb-6">Conectando talentos, construyendo futuro. La plataforma líder para estudiantes SENA.</p>
            <div class="flex space-x-4">
              <div class="w-10 h-10 bg-[#3B9D30] rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
                <span class="text-white font-bold">f</span>
              </div>
              <div class="w-10 h-10 bg-[#3B9D30] rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
                <span class="text-white font-bold">t</span>
              </div>
              <div class="w-10 h-10 bg-[#3B9D30] rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
                <span class="text-white font-bold">i</span>
              </div>
            </div>
          </div>
          <div>
            <h3 class="text-xl font-bold mb-4">Enlaces Rápidos</h3>
            <div class="space-y-2">
              <a href="#" class="block text-gray-300 hover:text-[#3B9D30] transition-colors">Sobre Nosotros</a>
              <a href="#" class="block text-gray-300 hover:text-[#3B9D30] transition-colors">Clubes</a>
              <a href="#" class="block text-gray-300 hover:text-[#3B9D30] transition-colors">Eventos</a>
              <a href="#" class="block text-gray-300 hover:text-[#3B9D30] transition-colors">Contacto</a>
            </div>
          </div>
          <div>
            <h3 class="text-xl font-bold mb-4">Contáctanos</h3>
            <div class="space-y-2 text-gray-300">
              <p>📧 info@senaclub.edu.co</p>
              <p>📱 +57 300 123 4567</p>
              <p>📍 Bogotá, Colombia</p>
            </div>
          </div>
        </div>
        <div class="border-t border-gray-700 pt-8 text-center">
          <p class="text-gray-400">© 2025 SenaClub - Todos los derechos reservados.</p>
        </div>
      </div>     
    </footer>   
  </div> 
</template>  

<script setup> 
// No logic necesario aún 
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
</style>