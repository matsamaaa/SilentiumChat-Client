<template>
    <div>
        <button
            @click="$emit('saved')"
            class="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-xl hover:bg-green-500 transition duration-150"
        >
            {{ text }}
        </button>
    </div>
</template>

<script setup>
const emit = defineEmits(['saved']);

const props = defineProps({
    text: {
        type: String,
        default: 'Confirm'
    }
});
</script>