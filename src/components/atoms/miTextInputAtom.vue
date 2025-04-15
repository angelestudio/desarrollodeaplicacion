<template>
  <input
    type="text"
    :id="inputId"
    :name="name"
    :value="modelValue"
    class="bg-gray-800 text-white border border-gray-700 p-2 rounded w-full"
    :placeholder="placeholder"
    @input="updateValue"
    v-bind="$attrs"
  />
</template>

<script>
export default {
  name: "miTextInputAtom",
  props: {
    modelValue: {          // Nueva prop para el v-model
      type: String,
      default: ""
    },
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
  },
  methods: {
    updateValue(event) {
     
      this.$emit("update:modelValue", event.target.value);
    }
  }
};
</script>