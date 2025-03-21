<script setup lang="ts">
  import { defineComponent } from 'vue'
  import CBButton from '../atoms/CBButton.vue'
  import CBInput from '../atoms/CBInput.vue';
  
  const handleClick = () => {
  alert('el boton no tiene nada');
}
</script>

  
  <style scoped>
  .registration-container{
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: black;
    padding: 13rem;
    min-height: 100vh;
    color: white;


  }

  .footer-text{
    margin-top: 1rem;
    text-align: center;
  }

  .registration-form {
    width: 100%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-top: 20px;
  }
  </style>
<template>
    <div class="registration-container">
  <h1>Create an account</h1>
    <CBInput
      id="email"
      label="Email"
      type="email"
      v-model="email"
      placeholder="Enter your email"
      required
      variant="filled"
    />
    <CBInput
      id="password"
      label="Password"
      type="password"
      v-model="password"
      placeholder="Enter your password"
      required
      variant="outlined"
    />
    <CBInput
        id="confirm-password"
        label="Confirm your password"
        type="password"
        v-model="confirmPassword"
        placeholder="Confirm your password"
        required
        variant="outlined"
      />

    <div class="flex justify-center mt-48">
    <CBButton
      @on-click="handleClick"
      label="register"
      variant="filled"
      class-name="mt-38"
      ></CBButton>
    </div>
    <div class="footer-text">
    Already have an account?
    <a>log in here</a>
    </div>
  </div>
 
</template>