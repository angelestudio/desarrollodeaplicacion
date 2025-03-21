<script setup lang="ts">
import type { Variants } from '@/types/commons'
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
};

const props = withDefaults(defineProps<CBInputProps>(), {
  type: 'text',
  placeholder: '',
  required: false,
  className: '',
  variant: 'default',
  modelValue: ''
});

const emit = defineEmits(['update:modelValue']);

const variants: any = {
  default: 'border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500',
  outlined: 'border border-slate-500 rounded-md focus:ring-purple-500 focus:border-purple-500',
  filled: 'bg-slate-100 border border-transparent rounded-md focus:ring-purple-500 focus:border-purple-500'
};

const style = computed<string>(() => variants[props.variant] as string);
</script>

<template>
  <div class="flex flex-col space-y-2">
    <label v-if="label" :for="id" class="text-sm font-medium text-gray-700">{{ label }}</label>
    <input
      :id="id"
      :type="type"
      :placeholder="placeholder"
      :required="required"
      :value="modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :class="`px-3 py-2 text-sm ${style} ${className}`"
    />
  </div>
</template>