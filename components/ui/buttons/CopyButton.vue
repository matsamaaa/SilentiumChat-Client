<template>
    <button 
        @click="emit('execute')" 
        :class="[
            'flex items-center px-3 py-1 text-xs font-medium rounded-lg transition duration-150 flex-shrink-0 mt-1',
            isCopied ? `bg-${props.color}-700 text-white` : `bg-${props.color}-600 text-white hover:bg-${props.color}-700`
        ]"
    >
        <FontAwesomeIcon :icon="isCopied ? 'fa-check' : 'fa-copy'" class="mr-2" />
        {{ isCopied ? 'Copied!' : 'Copy Key' }}
    </button>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const emit = defineEmits(['execute']);

const props = defineProps({
    isCopied: {
        type: Boolean,
        default: false
    },
    color: {
        type: String,
        default: 'indigo'
    }
});
</script>