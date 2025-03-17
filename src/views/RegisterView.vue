
<template>
    <div class="container">
      <Header />
      <RegistrationForm />
      <div class="login-section">
        <p>
          Already have an account? <LoginLink />
        </p>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue'
  import RegistrationForm from '../components/molecules/Login.vue'
  import LoginLink from '../components/atoms/LoginLink.vue'
  
  export default defineComponent({
    name: 'RegisterView',
    components: {
      RegistrationForm,
      LoginLink
    }
  })
  </script>
  
  <style scoped>
  .container {
    width: 50%;
    min-width: 400px;
    max-width: 600px;
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
   
  }
  
  .login-section {
    margin-top: 20px;
    color: #AAA;
    text-align: center;
  }
  </style>