<template>
  <div class="relative min-h-screen flex flex-col bg-black text-white">
    <!-- Fondo decorativo -->
    <div class="absolute inset-0 bg-gradient-to-br from-black via-green-950 to-black opacity-30 z-0"></div>

    <!-- NAVBAR -->
    <nav class="flex justify-between items-center px-10 py-6 relative z-10">
      <div class="flex items-center space-x-4">
        <img src="@/assets/logo-del-sena-01.png" alt="Logo SENA" class="w-10 h-10" />
        <div class="text-3xl font-extrabold">SENACLUB</div>
      </div>

      <div class="relative group">
        <button class="hover:text-[#39A900] focus:outline-none">
          Información
        </button>
        <div class="absolute hidden group-hover:block bg-black border border-[#39A900] text-sm mt-2 p-4 rounded-lg shadow-lg z-20 w-64">
          <p>Esta plataforma está diseñada para que aprendices, instructores y administrativos del SENA se conecten a través de clubes de interés.</p>
        </div>
      </div>

      <div class="flex space-x-6">
        <RouterLink to="/signin" class="hover:text-[#39A900]">Sign In</RouterLink>
        <RouterLink
          to="/signup"
          class="bg-[#39A900] text-white px-6 py-3 rounded-xl text-lg hover:bg-[#39A900]"
        >
          Sign Up
        </RouterLink>
      </div>
    </nav>

    <!-- MAIN CONTENT -->
    <main class="relative z-10 flex flex-1 justify-center items-center p-16 flex-wrap gap-16 text-center">
      <div class="max-w-xl">
        <p class="text-xl text-[#39A900] font-medium mb-2 animate-pulse">
          ¡Forma parte de la comunidad SENA!
        </p>
        <h1 class="text-5xl font-bold text-[#39A900] mb-6">¡Bienvenidos a SenaClub!</h1>
        <p class="text-lg mb-8">
          Explora nuestros clubes y encuentra el ideal para ti. Desde deportes hasta tecnología y finanzas,
          únete a una comunidad que comparte tus intereses.
        </p>
        <RouterLink to="/clubs" class="text-[#3B9D30] hover:text-[#39A900] text-xl underline">
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

    <!-- SECCIÓN CON BOTONES DESPLEGABLES -->
    <section class="relative z-10 px-12 py-16 grid grid-cols-1 md:grid-cols-3 gap-10 bg-black">
      <!-- Deportes -->
      <div
        @click="toggleClub('deportes')"
        class="cursor-pointer bg-green-900 bg-opacity-10 p-6 rounded-xl shadow-lg hover:scale-105 transition"
      >
        <h3 class="text-xl font-bold text-[#39A900] mb-2">Deportes</h3>
        <p>Únete a clubes deportivos y mantente activo mientras haces nuevos amigos.</p>
        <div v-if="activeClub === 'deportes'" class="mt-4 text-sm text-gray-300">
          <ul class="list-disc list-inside text-left">
            <li>Club de fútbol y torneos intersena.</li>
            <li>Entrenamiento funcional y bienestar físico.</li>
            <li>Actividades de senderismo y ciclismo.</li>
          </ul>
        </div>
      </div>

      <!-- Tecnología -->
      <div
        @click="toggleClub('tecnologia')"
        class="cursor-pointer bg-green-900 bg-opacity-10 p-6 rounded-xl shadow-lg hover:scale-105 transition"
      >
        <h3 class="text-xl font-bold text-[#39A900] mb-2">Tecnología</h3>
        <p>Explora clubes de robótica, programación, IA y mucho más.</p>
        <div v-if="activeClub === 'tecnologia'" class="mt-4 text-sm text-gray-300">
          <ul class="list-disc list-inside text-left">
            <li>Club de programación en JavaScript y Python.</li>
            <li>Laboratorio de IA y aprendizaje automático.</li>
            <li>Hackathones y eventos tecnológicos.</li>
          </ul>
        </div>
      </div>

      <!-- Finanzas -->
      <div
        @click="toggleClub('finanzas')"
        class="cursor-pointer bg-green-900 bg-opacity-10 p-6 rounded-xl shadow-lg hover:scale-105 transition"
      >
        <h3 class="text-xl font-bold text-[#39A900] mb-2">Finanzas</h3>
        <p>Aprende sobre ahorro, inversión y emprendimiento con otros aprendices.</p>
        <div v-if="activeClub === 'finanzas'" class="mt-4 text-sm text-gray-300">
          <ul class="list-disc list-inside text-left">
            <li>Talleres de presupuesto personal y ahorro.</li>
            <li>Club de emprendimiento y modelos de negocio.</li>
            <li>Charlas con expertos en inversión y economía.</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="relative z-10 bg-black p-12 text-center text-sm text-gray-500">
      © 2025 SenaClub - Todos los derechos reservados.
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeClub = ref(null)

function toggleClub(club) {
  activeClub.value = activeClub.value === club ? null : club
}
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fadeIn 1s ease-out forwards;
}
</style>