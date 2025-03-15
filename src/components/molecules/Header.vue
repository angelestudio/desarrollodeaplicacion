<!-- src/components/molecules/Header.vue -->
<template>
    <header class="header">
      <img src="@/assets/logo.png" alt="Logo" class="logo" />
    </header>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue'
  
  export default defineComponent({
    name: 'Header'
  })
  </script>
  
  <style scoped>
  .header {
    margin-top: 20px;
    text-align: center;
  }
  
  .logo {
    max-width: 100%;
    height: auto;
  }
  </style>