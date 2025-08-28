<template>
    <a 
        :href="url" 
        :download="filename" 
        class="text-blue-600 hover:text-blue-800 transition"
    >
        <FontAwesomeIcon :icon="['fas', 'download']" />
    </a>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const props = defineProps({
    url: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    }
})
</script>
