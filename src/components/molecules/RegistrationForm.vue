
<template>
    <form class="registration-form">
      <InputField type="email" placeholder="Email" />
      <InputField type="password" placeholder="Password" />
      <InputField type="password" placeholder="Confirm your password" />
      <Button text="Register" />
    </form>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue'
  import InputField from '../atoms/InputField.vue'
  import Button from '../atoms/Button.vue'
  
  export default defineComponent({
    name: 'RegistrationForm',
    components: {
      InputField,
      Button
    }
  })
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