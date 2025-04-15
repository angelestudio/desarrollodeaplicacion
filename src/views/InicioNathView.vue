<template>
  <div class="min-h-screen flex flex-col bg-black text-white">
    <nav class="flex justify-between items-center px-6 py-4 bg-black">
      <div class="text-2xl font-bold">SENACLUB</div>
      <div class="flex space-x-4">
        <a href="#" class="hover:text-purple-400">Clubs</a>
        <a href="#" class="hover:text-purple-400">News</a>
        <a href="#" class="hover:text-purple-400">SENA</a>
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

    <div class="flex flex-1 justify-between items-start p-12 flex-wrap gap-12">
      <div class="max-w-md">
        <p class="text-lg mb-4">Explora nuestros clubes y encuentra el ideal para ti</p>
        <h1 class="text-4xl font-bold text-purple-500 mb-4">¡Bienvenidos a SenaClub!</h1>
        <p class="text-base mb-6">
          Desde deportes hasta tecnología y finanzas, únete a una comunidad que comparte tus intereses.
        </p>
        <button class="bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700">
          Explorar Clubes
        </button>
      </div>

      <div class="max-w-sm">
        <p class="text-lg font-semibold mb-4">Clientes felices</p>
        <div class="flex justify-around space-x-4">
          <span>Logo 1</span>
          <span>Logo 2</span>
          <span>Logo 3</span>
        </div>
      </div>
    </div>

    <footer class="bg-black p-12">
      <div class="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
        <div>
          <p class="text-lg font-semibold mb-4">Clubes populares</p>
          <a href="#" class="block mb-2 hover:text-purple-400">Futbol</a>
          <a href="#" class="block mb-2 hover:text-purple-400">Ingles</a>
          <a href="#" class="block mb-2 hover:text-purple-400">Danzas</a>
          <a href="#" class="block mb-2 hover:text-purple-400">Emprendimiento</a>
          <a href="#" class="block mb-2 hover:text-purple-400">Programacion</a>
        </div>
        <div>
          <p class="text-lg font-semibold mb-4">Mi Cuenta</p>
          <a href="#" class="block mb-2 hover:text-purple-400">Mi perfil</a>
          <a href="#" class="block mb-2 hover:text-purple-400">Mis clubes</a>
          <a href="#" class="block mb-2 hover:text-purple-400">Seguidos</a>
          <a href="#" class="block mb-2 hover:text-purple-400">Noticias</a>
          <a href="#" class="block mb-2 hover:text-purple-400">Configuracion</a>
        </div>
        <div>
          <p class="text-lg font-semibold mb-4">Plataforma</p>
          <a href="#" class="block mb-2 hover:text-purple-400">Sobre SenaClub</a>
          <a href="#" class="block mb-2 hover:text-purple-400">Como funciona</a>
          <a href="#" class="block mb-2 hover:text-purple-400">Eventos y retos</a>
          <a href="#" class="block mb-2 hover:text-purple-400">Contactanos</a>
          <a href="#" class="block mb-2 hover:text-purple-400">Bienestar</a>
        </div>
        <div>
          <p class="text-lg font-semibold mb-4">Recursos Utiles</p>
          <a href="#" class="block mb-2 hover:text-purple-400">Biblioteca Virtual</a>
          <a href="#" class="block mb-2 hover:text-purple-400">Bolsa De Empleo Sena</a>
          <a href="#" class="block mb-2 hover:text-purple-400">Certificados en linea</a>
          <a href="#" class="block mb-2 hover:text-purple-400">Cursos recomendados</a>
          <a href="#" class="block mb-2 hover:text-purple-400">Calendario Academico</a>
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
// No logic needed here for esta vista estática por ahora
</script>