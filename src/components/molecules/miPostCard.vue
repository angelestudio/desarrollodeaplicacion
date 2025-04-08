<template>
  <div class="p-4 border-b border-gray-700 shadow-md mb-4 flex flex-col">
    <div class="flex items-center space-x-2 mb-2">
      <span class="text-blue-400 font-bold">@david</span>
      <span class="text-gray-400">- {{ club }}</span>
    </div>

    <h3 class="text-white font-bold">{{ title }}</h3>
    <p class="text-gray-400 text-sm mt-1">{{ subtitle }}</p>

    <div class="flex space-x-2 mt-2">
      <miButtonAtom
        @click="updatePost"
        class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full"
      >
        Actualizar
      </miButtonAtom>

      <miButtonAtom
        @click="deletePost"
        class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full"
      >
        Eliminar
      </miButtonAtom>
    </div>
  </div>
</template>

<script setup lang="ts">
import miButtonAtom from '@/components/atoms/miButtonAtom.vue';

const props = defineProps<{
  title: string;
  subtitle: string;
  postId: string | number;
  club?: string;
}>();

const emit = defineEmits<{
  (event: 'update', id: string | number): void;
  (event: 'delete', id: string | number): void;
}>();

const { title, subtitle, postId, club } = props;

const updatePost = () => {
  emit('update', postId);
};

const deletePost = () => {
  emit('delete', postId);
};

defineExpose({ updatePost, deletePost });
</script>