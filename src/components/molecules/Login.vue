<script setup lang="ts">
  import { defineComponent } from 'vue'
  import CBButton from '../atoms/CBButton.vue'
  import CBInput from '../atoms/CBInput.vue';
  
  const handleClick = () => {
  alert('el boton no tiene nada');
}
</script>
  
  <style scoped>
  .registration-form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-top: 30px;
  }
  </style>
<template>
    <div class="registration-form">
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
    <CBButton
      @on-click="handleClick"
      label="register"
      variant="filled"
      ></CBButton>
  </div>
</template>