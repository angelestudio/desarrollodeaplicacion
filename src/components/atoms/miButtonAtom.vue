<template>
  <button
    @click="handleClick"
    class="text-center text-white font-bold py-2 px-4 w-full"
    :class="$attrs.class"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: "ButtonAtom",
  inheritAttrs: false,
  props: {
    to: {
      type: [String, Object],
      default: null,
    },
  },
  methods: {
    handleClick() {
      console.log(" Botón clickeado"); 
      if (this.to) {
        this.$router.push(this.to);
      } else {
        this.$emit("click"); 
      }
    },
  },
};
</script>