<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div
      class="bg-white rounded-2xl shadow-2xl p-6 w-80 text-center animate-fadeIn"
    >
      <h2 class="text-2xl font-bold text-emerald-600 mb-3">¡Bienvenido! 🎉</h2>
      <p class="text-gray-700">Has iniciado sesión correctamente.</p>
      <button
        @click="$emit('close')"
        class="mt-4 bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition"
      >
        Cerrar
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>
