
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
    color: #0000ff; 
    text-decoration: none;
    transition: color 0.3s, text-decoration 0.3s;
  }
  
  .login-link:hover {
    color: #0000ff; 
    text-decoration: underline;
  }
  </style>