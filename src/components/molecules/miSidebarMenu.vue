<template>
  <div class="p-4 bg-black h-full w-full">
    <div class="flex items-center space-x-2 mb-4">
      <miImageAtom
        alt="Logo SENACLUB"
        class="w-8 h-8"
        src="/src/assets/logo.png" 
      />
      <span class="font-bold text-white text-lg">SENACLUB</span>
    </div>

    <nav class="flex flex-col space-y-2">
      <miButtonAtom class="text-white text-center px-4 py-2 rounded-full hover:bg-gray-700" to="/">Casa</miButtonAtom>
      <miButtonAtom class="text-white text-center px-4 py-2 rounded-full hover:bg-gray-700" to="/clubs">Clubs</miButtonAtom>
      <miButtonAtom class="text-white text-center px-4 py-2 rounded-full hover:bg-gray-700" to="/explorar">Explorar</miButtonAtom>
      <miButtonAtom class="text-white text-center px-4 py-2 rounded-full hover:bg-gray-700" to="/noticias">Noticias</miButtonAtom>
      <miButtonAtom class="text-white text-center px-4 py-2 rounded-full hover:bg-gray-700" to="/notificationes">Notificationes</miButtonAtom>
      <miButtonAtom class="text-white text-center px-4 py-2 rounded-full hover:bg-gray-700" to="/posteos">Posteos</miButtonAtom>
    </nav>
  </div>
</template>

<script>
import miImageAtom from '@/components/atoms/miimageAtom.vue'
import miButtonAtom from "@/components/atoms/miButtonAtom.vue";

export default {
  name: "SidebarMenu",
  components: { miImageAtom, miButtonAtom }
}
</script>