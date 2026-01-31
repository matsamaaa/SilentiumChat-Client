<template>
    <div>
        <button
            v-if="updates"
            @click="$emit('saved')"
            class="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-xl hover:bg-green-500 transition duration-150"
        >
            Save Changes
        </button>
    </div>
</template>

<script setup>
const emit = defineEmits(['saved']);

const props = defineProps({
    updates: {
        type: Boolean,
        required: true,
        default: false
    }
});
</script>