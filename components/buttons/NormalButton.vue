<template>
    <button 
        @click="emit('execute')"
        type="submit"
        :class="`px-5 py-2 bg-${props.color}-600 text-white font-medium rounded-lg shadow-md hover:bg-${props.color}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${props.color}-500 focus:ring-offset-gray-900 transition duration-150`"
    >
        <FontAwesomeIcon :icon="icon" class="mr-2" />
        {{ label }}
    </button>
</template>

<script setup>
import { defineEmits } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
const emit = defineEmits(['execute']);

const props = defineProps({
    label: {
        type: String,
        default: 'Reset Encryption Keys'
    },
    icon: {
        type: String,
        default: 'fa-lock'
    },
    color: {
        type: String,
        default: 'indigo'
    }
});
</script>