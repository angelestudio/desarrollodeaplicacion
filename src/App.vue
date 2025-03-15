<!-- src/App.vue -->
<template>
    <div id="app">
      <RegisterView />
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue'
  import RegisterView from './views/RegisterView.vue'
  
  export default defineComponent({
    name: 'App',
    components: {
      RegisterView
    }
  })
  </script>
  
  <style>
  /* Estilos globales adicionales si se requieren */
  </style>