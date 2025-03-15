<!-- src/components/atoms/Button.vue -->
<template>
    <button class="btn">
      {{ text }}
    </button>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue'
import type { PropType } from 'vue'
  
  export default defineComponent({
    name: 'Button',
    props: {
      text: {
        type: String as PropType<string>,
        required: true
      }
    }
  })
  </script>
  
  <style scoped>
  .btn {
    width: 100%;
    min-height: 50px;
    background-color: #6A5ACD;
    color: #FFF;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .btn:hover {
    background-color: #7B68EE;
  }
  </style>