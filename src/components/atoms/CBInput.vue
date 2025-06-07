<script setup lang="ts">
import { computed } from 'vue';

type CBInputProps = {
  id: string;
  label?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  variant?: 'default' | 'outlined' | 'filled';
  modelValue?: string;
  theme?: 'light' | 'dark'; // Agregar la prop theme
};

const props = withDefaults(defineProps<CBInputProps>(), {
  type: 'text',
  placeholder: '',
  required: false,
  className: '',
  variant: 'default',
  modelValue: '',
  theme: 'light'
});

const emit = defineEmits(['update:modelValue']);

// Estilos base según el tema
const getThemeStyles = computed(() => {
  if (props.theme === 'light') {
    return {
      input: 'bg-white text-black border-gray-300 focus:border-purple-500',
      label: 'text-gray-700'
    };
  } else {
    return {
      input: 'bg-gray-800 text-white border-gray-600 focus:border-purple-500',
      label: 'text-white'
    };
  }
});

// Variantes de estilo
const variants: any = {
  default: 'border rounded-md focus:ring-purple-500',
  outlined: 'border-2 rounded-md focus:ring-purple-500',
  filled: 'border rounded-md focus:ring-purple-500'
};

const inputClasses = computed(() => {
  const baseClasses = 'w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500';
  const themeClasses = getThemeStyles.value.input;
  const variantClasses = variants[props.variant];
  
  return `${baseClasses} ${themeClasses} ${variantClasses} ${props.className}`;
});
</script>

<template>
  <div class="flex flex-col space-y-2">
    <label 
      v-if="label" 
      :for="id" 
      class="text-sm font-medium"
      :class="getThemeStyles.label"
    >
      {{ label }}
    </label>
    <input
      :id="id"
      :type="type"
      :placeholder="placeholder"
      :required="required"
      :value="modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :class="inputClasses"
    />
  </div>
</template>