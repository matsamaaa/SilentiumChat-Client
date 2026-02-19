<template>
    <button @click="$emit('execute')" class="flex flex-row gap-2 items-center overflow-hidden bg-gray-800 hover:bg-gray-700 my-1 mx-2 p-1 rounded-lg duration-200 text-indigo-600 hover:text-indigo-500 text-sm font-bold">
        <FontAwesomeIcon
            :icon="icon" />
        <p>{{ label }}</p>
    </button>    
</template>

<script setup>
const props = defineProps({
    label: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: 'fa-hashtag'
    }
})

const emit = defineEmits(['execute'])
</script>