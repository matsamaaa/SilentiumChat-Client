<template>
    <div>
        <button @click="$emit('execute')" class="px-4 py-2 bg-gray-800 text-red-500 border border-red-500 rounded-lg hover:bg-gray-700 transition duration-200">
            {{ props.text || '' }}
        </button>
    </div>
</template>

<script setup>
const props = defineProps({
    text: {
        type: String,
        required: false,
    }
});
const emit = defineEmits(['execute']);
</script>