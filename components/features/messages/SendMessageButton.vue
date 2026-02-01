<template>
    <div>
        <label
            class="cursor-pointer p-3 bg-indigo-600 text-white rounded-full shadow hover:bg-indigo-500 transition"
            @click="$emit('send')"
        >
            <FontAwesomeIcon :icon="['fas', 'paper-plane']" />
        </label>
    </div>
</template>

<script setup>
const emit = defineEmits(['send']);
</script>