<template>
  <input
    type="text"
    :id="inputId"
    :name="name"
    class="bg-gray-800 text-white border border-gray-700 p-2 rounded w-full"
    :placeholder="placeholder"
    v-bind="$attrs"
  />
</template>

<script>
export default {
  name: "miTextInputAtom",
  props: {
    placeholder: {
      type: String,
      default: ""
    },
    name: {
      type: String,
      default: "text-input"
    },
    id: {
      type: String,
      default: ""
    }
  },
  computed: {
    inputId() {
      return this.id || `text-input-${Math.random().toString(36).substr(2, 9)}`;
    }
  }
};
</script>