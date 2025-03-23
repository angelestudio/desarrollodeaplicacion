<script setup lang="ts">
import { computed } from 'vue'

//TODO: Use an icon with 'animate-spin' class from tailwind to replace this package.
import {
  VueSpinner
  // ...
} from 'vue3-spinners'

type CBButtonProps = {
  label?: string
  className?: string
  variant?: 'filled' | 'tonal' | 'tonal-room' | 'elevated' | 'outlined' | 'text' | 'red'
  loading?: boolean
  width?: string
}

const props = withDefaults(defineProps<CBButtonProps>(), {
  variant: 'filled',
  className: '',
  loading: false
})

const variants: any = {
  filled:
    'bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-full',
  tonal: 'bg-slate-300 border border-transparent text-grey-800',
  'tonal-room': 'bg-slate-600 border border-transparent text-slate-200',
  elevated: 'bg-slate-200 border border-transparent text-secondary-500 shadow',
  outlined: 'border border-slate-500 text-secondary-500',
  text: 'text-secondary-500 border border-transparent',
  red: 'bg-red-300 border border-transparent text-white'
}

defineEmits<{ onClick: [] }>()

const style = computed<string>(() => variants[props.variant] as string)
</script>

<template>
  <button
    :class="`flex justify-center items-center gap-x-1 py-2 px-7 rounded-full text-sm ${style} ${className}`"
    type="button"
    @click="$emit('onClick')"
  >
    <slot name="icon"></slot> {{ label }}
  </button>
</template>