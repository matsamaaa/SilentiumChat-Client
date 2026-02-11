<template>
    <button 
        @click="emit('execute')"
        type="submit"
        :class="`px-5 py-2 ${props.bgSelect ? `bg-${props.color}-600` : ''} text-white text-${props.textSize} font-medium rounded-lg shadow-md hover:bg-${props.color}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${props.color}-500 focus:ring-offset-gray-900 transition duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`"
        :disabled="props.disabled"
    >
        <FontAwesomeIcon :icon="icon" class="mr-2" />
        {{ label }}
    </button>
</template>

<script setup>
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
    },
    disabled: {
        type: Boolean,
        default: false
    },
    textSize: {
        type: String,
        default: 'base'
    },
    bgSelect: {
        type: Boolean,
        default: true
    }
});
</script>