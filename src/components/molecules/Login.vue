<script setup lang="ts">
  import { defineComponent } from 'vue'
  import InputField from '../atoms/InputField.vue'
  import CBButton from '../atoms/CBButton.vue'
  
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
    <div>
    <CBButton
      @on-click="handleClick"
      label="register"
      variant="filled"
      ></CBButton>
  </div>
</template>