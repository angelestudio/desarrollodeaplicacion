<template>
  <div class="club-card">
    <p>{{ name }}</p>
  </div>
</template>

<script>
export default {
  props: {
    name: String,
  },
};
</script>

<style scoped>
.club-card {
  text-align: center;
  padding: 20px;
  background: #222;
  color: white;
  border-radius: 10px;
  font-weight: bold;
}
</style>
