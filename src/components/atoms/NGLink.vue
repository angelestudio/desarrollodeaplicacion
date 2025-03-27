<template>
    <a :href="href" class="nav-link"><slot /></a>
  </template>
  
  <script>
  export default {
    props: {
      href: { type: String, required: true },
    },
  };
  </script>
  
  <style scoped>
  .nav-link {
    color: white;
    text-decoration: none;
    padding: 10px;
  }
  </style>
  