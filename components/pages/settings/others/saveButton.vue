<template>
    <div class="mt-8 pt-4 flex flex-row justify-end items-center space-x-4">
        <p v-if="updates" class="text-red-500 font-medium italic">You have unsaved changes.</p>
        <button
            @click="$emit('saved')"
            class="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-xl hover:bg-green-500 transition duration-150"
        >
            Save Changes
        </button>
    </div>
</template>

<script setup>
const props = defineProps({
    updates: {
        type: Boolean,
        required: true,
        default: false
    }
});
</script>