<template>
  <div class="min-h-screen flex flex-col bg-black text-white">
    <!-- NAVBAR -->
    <nav class="flex justify-between items-center px-6 py-4 bg-black">
      <div class="text-2xl font-bold">SENACLUB</div>
      <div class="flex space-x-4">
        <a href="#" class="hover:text-purple-400">Sena mejora tu vida</a>
      </div>
      <div class="flex space-x-4">
        <RouterLink to="/signin" class="hover:text-purple-400">Sign In</RouterLink>
        <RouterLink
          to="/signup"
          class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Sign Up
        </RouterLink>
      </div>
    </nav>

    <!-- MAIN CONTENT -->
    <div class="flex flex-1 justify-between items-center p-12 flex-wrap gap-12">
      <div class="max-w-md">
        <p class="text-lg mb-4">Explora nuestros clubes y encuentra el ideal para ti</p>
        <h1 class="text-4xl font-bold text-purple-500 mb-4">¡Bienvenidos a SenaClub!</h1>
        <p class="text-base mb-6">
          Desde deportes hasta tecnología y finanzas, únete a una comunidad que comparte tus intereses.
        </p>
        <RouterLink to="/clubs" class="text-purple-500 hover:text-purple-400 text-lg underline">
          Explorar Clubes
        </RouterLink>
      </div>

      <!-- IMAGEN -->
      <div class="max-w-sm animate-fade-in">
        <img src="@/assets/inicio.png.jpeg" alt="Imagen de Inicio" class="w-full rounded-lg shadow-lg" />
      </div>
    </div>

    <!-- FOOTER -->
    <footer class="bg-black p-12">
      <div class="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
        <div>
          <p class="text-lg font-semibold mb-4">Clubes populares</p>
          <p class="block mb-2 hover:text-purple-400">Futbol</p>
          <p class="block mb-2 hover:text-purple-400">Ingles</p>
          <p class="block mb-2 hover:text-purple-400">Danzas</p>
          <p class="block mb-2 hover:text-purple-400">Emprendimiento</p>
          <p class="block mb-2 hover:text-purple-400">Programacion</p>
        </div>
        <div>
          <p class="text-lg font-semibold mb-4">Mi Cuenta</p>
          <p class="block mb-2 hover:text-purple-400">Mi perfil</p>
          <p class="block mb-2 hover:text-purple-400">Mis clubes</p>
          <p class="block mb-2 hover:text-purple-400">Seguidos</p>
          <p class="block mb-2 hover:text-purple-400">Noticias</p>
          <p class="block mb-2 hover:text-purple-400">Configuracion</p>
        </div>
        <div>
          <p class="text-lg font-semibold mb-4">Plataforma</p>
          <p class="block mb-2 hover:text-purple-400">Sobre SenaClub</p>
          <p class="block mb-2 hover:text-purple-400">Como funciona</p>
          <p class="block mb-2 hover:text-purple-400">Eventos y retos</p>
          <p class="block mb-2 hover:text-purple-400">Contactanos</p>
          <p class="block mb-2 hover:text-purple-400">Bienestar</p>
        </div>
        <div>
          <p class="text-lg font-semibold mb-4">Recursos Utiles</p>
          <p class="block mb-2 hover:text-purple-400">Biblioteca Virtual</p>
          <p class="block mb-2 hover:text-purple-400">Bolsa De Empleo Sena</p>
          <p class="block mb-2 hover:text-purple-400">Certificados en linea</p>
          <p class="block mb-2 hover:text-purple-400">Cursos recomendados</p>
          <p class="block mb-2 hover:text-purple-400">Calendario Academico</p>
        </div>
        <div>
          <p class="text-lg font-semibold mb-4">¿Necesitas ayuda?</p>
          <p class="mb-1">Horario de atención en línea</p>
          <p class="mb-1">Lunes a viernes 9:00 a.m - 7:00 p.m</p>
          <p class="mb-4">Sábados 8:00 a.m - 1:00 p.m</p>
          <div class="flex space-x-3">
            <a class="bg-purple-600 w-8 h-8 rounded-full flex items-center justify-center text-white">f</a>
            <a class="bg-purple-600 w-8 h-8 rounded-full flex items-center justify-center text-white">in</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
// No logic needed here todavía amor
</script>

<style scoped>
/* Animación para que la imagen aparezca suavemente */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 1s ease-out forwards;
}
</style>