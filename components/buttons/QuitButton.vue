<template>
    <div class="absolute top-4 right-4">
        <button @click="$emit('execute')" class="hover:text-red-500 transition text-white text-2xl">
            <FontAwesomeIcon :icon="['fas', 'xmark']" />
        </button>
    </div>
</template>

<script setup>
const emit = defineEmits(['execute']);
</script>