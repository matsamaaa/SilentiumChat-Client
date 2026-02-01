<template>
    <input
        v-bind="$attrs"
        :type="type"
        :value="modelValue ?? ''"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :required="required"
        class="block w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        @input="onInput"
        @keyup.enter="emit('search')"
    >
</template>

<script setup>
defineOptions({ inheritAttrs: false });

defineProps({
    modelValue: {
        type: [String, Number, null],
        default: null
    },
    type: {
        type: String,
        default: 'text'
    },
    placeholder: {
        type: String,
        default: ''
    }, 
    autocomplete: {
        type: String,
        default: 'off'
    },
    required: {
        type: Boolean,
        default: false
    },
});

const emit = defineEmits(['update:modelValue', 'search']);

const onInput = (event) => {
    emit('update:modelValue', event.target.value);
};
</script>