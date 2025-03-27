<template>
    <component :is="tag">{{ text }}</component>
  </template>
  
  <script setup>
  const props = defineProps({
    tag: {
      type: String,
      default: 'p'
    },
    text: {
      type: String,
      required: true
    }
  });
  </script>