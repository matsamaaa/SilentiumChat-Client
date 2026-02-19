<template>
    <div
        class="bg-indigo-600 text-white rounded-b-lg hover:bg-indigo-500 transition duration-150 shadow-md w-full h-32 overflow-hidden relative p-0"
    >
        <h2 class="absolute top-1 left-3 z-10 font-bold text-lg bg-gray-900/60 px-2 rounded w-fit">{{ name }}</h2>
        <img v-if="banner" :src="banner" alt="Server Banner Preview" class="absolute inset-0 w-full h-full object-cover block"/>
    </div>
</template>

<script setup>
const props = defineProps({
    name: {
        type: String,
        required: true
    },
    banner: {
        type: String,
        required: false
    }
})
</script>