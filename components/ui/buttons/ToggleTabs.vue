<template>
    <div class="inline-flex rounded-lg bg-gray-900 border border-gray-700 p-1 gap-1">
        <button
            v-for="option in options"
            :key="option.value"
            type="button"
            class="px-4 py-2 text-sm font-medium rounded-md transition"
            :class="modelValue === option.value ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-800'"
            @click="emit('update:modelValue', option.value)"
        >
            {{ option.label }}
        </button>
    </div>
</template>

<script setup>
const emit = defineEmits(['update:modelValue']);

defineProps({
    modelValue: {
        type: String,
        required: true
    },
    options: {
        type: Array,
        required: true,
        // [{ value: string, label: string }]
    }
});
</script>
