<template>
  <div class="p- border-b border-gray-700 bg-blackflex flex-col space-y-2">
    <span class="block mx-auto bg-blue-700 px-3 py-2 rounded text-white text-sm w-fit">
      siguiendo
    </span>
    <h2 class="text-white font-bold text-xl">David</h2>
    <miTextInputAtom placeholder="¿Qué quieres expresar el día de hoy?" class="bg-gray-800 text-white border border-gray-700 rounded-lg" />
  </div>
</template>

<script>
import miTextInputAtom from "../atoms/miTextInputAtom.vue";

export default {
  name: "HeaderSection",
  components: { miTextInputAtom }
}
</script>