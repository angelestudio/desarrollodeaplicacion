<!-- src/components/atoms/LoginLink.vue -->
<template>
    <a href="/login" class="login-link">
      Log in here
    </a>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue'
  
  export default defineComponent({
    name: 'LoginLink'
  })
  </script>
  
  <style scoped>
  .login-link {
    color: #add8e6; /* azul claro */
    text-decoration: none;
    transition: color 0.3s, text-decoration 0.3s;
  }
  
  .login-link:hover {
    color: #0000ff; /* azul más fuerte */
    text-decoration: underline;
  }
  </style>