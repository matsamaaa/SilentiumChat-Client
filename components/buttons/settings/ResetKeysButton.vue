<template>
    <div>
        <button 
            @click="emit('execute')"
            type="submit"
            class="px-5 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 transition duration-150"
        >
            <FontAwesomeIcon icon="fa-lock" class="mr-2" />
            Reset Encryption Keys
        </button>
    </div>
</template>

<script setup>
import { defineEmits } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
const emit = defineEmits(['execute']);
</script>