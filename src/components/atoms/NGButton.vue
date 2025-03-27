<template>
  <button :class="buttonClass">
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    variant: { type: String, default: "default" },
  },
  computed: {
    buttonClass() {
      return this.variant === "primary" ? "btn-primary" : "btn-default";
    },
  },
};
</script>

<style scoped>
.btn-primary {
  background-color: #635bff;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
}
.btn-default {
  background: transparent;
  color: white;
  border: 1px solid white;
  padding: 10px 20px;
  border-radius: 5px;
}
</style>
