<template>
    <nav class="navbar">
      <ul>
        <li><Link href="#">SENACLUB</Link></li>
        <li><Link href="#">Clubs</Link></li>
        <li><Link href="#">News</Link></li>
        <li><Link href="#">SENA</Link></li>
        <li><Button variant="default">Sign In</Button></li>
        <li><Button variant="primary">Sign Up</Button></li>
      </ul>
    </nav>
  </template>
  
  <script>
  import Link from "@/components/atoms/Link.vue";
  import Button from "@/components/atoms/Button.vue";
  
  export default {
    components: { Link, Button },
  };
  </script>
  
  <style scoped>
  .navbar {
    display: flex;
    justify-content: space-between;
    background: black;
    padding: 20px;
    color: white;
  }
  ul {
    display: flex;
    list-style: none;
    gap: 20px;
  }
  </style>
  