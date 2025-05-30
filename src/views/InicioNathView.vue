<template>
  <div class="relative min-h-screen flex flex-col bg-black text-white">
    <!-- Fondo decorativo -->
    <div class="absolute inset-0 bg-gradient-to-br from-black via-green-950 to-black opacity-30 z-0"></div>

    <!-- NAVBAR -->
    <nav class="flex justify-between items-center px-10 py-6 relative z-10">
      <div class="text-3xl font-extrabold">SENACLUB</div>
      <div class="flex space-x-6">
        <a href="#" class="hover:text-[#3B9D30]">Sena mejora tu vida</a>
      </div>
      <div class="flex space-x-6">
        <RouterLink to="/signin" class="hover:text-[#3B9D30]">Sign In</RouterLink>
        <RouterLink
          to="/signup"
          class="bg-[#3B9D30] text-white px-6 py-3 rounded-xl text-lg hover:bg-[#2E7D2E]"
        >
          Sign Up
        </RouterLink>
      </div>
    </nav>

    <!-- MAIN CONTENT -->
    <main class="relative z-10 flex flex-1 justify-center items-center p-16 flex-wrap gap-16 text-center">
      <div class="max-w-xl">
        <p class="text-xl text-[#3B9D30] font-medium mb-2 animate-pulse">
          ¡Forma parte de la comunidad SENA!
        </p>
        <h1 class="text-5xl font-bold text-[#3B9D30] mb-6">¡Bienvenidos a SenaClub!</h1>
        <p class="text-lg mb-8">
          Explora nuestros clubes y encuentra el ideal para ti. Desde deportes hasta tecnología y finanzas,
          únete a una comunidad que comparte tus intereses.
        </p>
        <RouterLink to="/clubs" class="text-[#3B9D30] hover:text-[#2E7D2E] text-xl underline">
          Explorar Clubes
        </RouterLink>
      </div>

      <!-- IMAGEN -->
      <div class="max-w-md animate-fade-in">
        <img
          src="@/assets/inicio.png.jpeg"
          alt="Imagen de Inicio"
          class="w-full rounded-2xl shadow-2xl"
        />
      </div>
    </main>

    <!-- SECCIÓN ADICIONAL -->
    <section class="relative z-10 px-12 py-16 grid grid-cols-1 md:grid-cols-3 gap-10 bg-black">
      <div class="bg-green-900 bg-opacity-10 p-6 rounded-xl shadow-lg hover:scale-105 transition">
        <h3 class="text-xl font-bold text-[#3B9D30] mb-2">Deportes</h3>
        <p>Únete a clubes deportivos y mantente activo mientras haces nuevos amigos.</p>
      </div>
      <div class="bg-green-900 bg-opacity-10 p-6 rounded-xl shadow-lg hover:scale-105 transition">
        <h3 class="text-xl font-bold text-[#3B9D30] mb-2">Tecnología</h3>
        <p>Explora clubes de robótica, programación, IA y mucho más.</p>
      </div>
      <div class="bg-green-900 bg-opacity-10 p-6 rounded-xl shadow-lg hover:scale-105 transition">
        <h3 class="text-xl font-bold text-[#3B9D30] mb-2">Finanzas</h3>
        <p>Aprende sobre ahorro, inversión y emprendimiento con otros aprendices.</p>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="relative z-10 bg-black p-12 text-center text-sm text-gray-500">
      © 2025 SenaClub - Todos los derechos reservados.
    </footer>
  </div>
</template>

<script setup>
// No logic necesario aún
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 1s ease-out forwards;
}
</style>
