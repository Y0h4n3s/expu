<template>
    <div>
        <label v-bind:for="id()"
               class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{ label }}</label>
        <input type="number" v-bind:id="id()" v-model="value"
               class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
               v-bind:placeholder="placeholderText" required >
    </div>
</template>

<script>
export default {
    name: 'NumberInput',
    props: ['modelValue', "placeholderText", "label"],
  emits: ['update:modelValue'],
    methods: {
        id() {
            return this.label.replace(" ", "_") + "_input_label"
        },
    },
    computed: {
        name() {
            return this.label.toLowerCase();
        },
    value: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
    },
}
</script>