
<template>
    <input
      :type="type"
      :placeholder="placeholder"
      class="input-field"
    />
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue'
  import type { PropType } from 'vue'
  export default defineComponent({
    name: 'InputField',
    props: {
      type: {
        type: String as PropType<string>,
        default: 'text'
      },
      placeholder: {
        type: String as PropType<string>,
        required: true
      }
    }
  })
  </script>
  
  <style scoped>
  .input-field {
    width: 100%;
    height: 50px;
    border: none;
    border-radius: 8px;
    background-color: #222;
    color: #FFF;
    padding: 10px;
    box-sizing: border-box;
  }
  </style>