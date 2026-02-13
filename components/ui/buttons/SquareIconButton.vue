<template>
    <button
        type="button"
        class="bg-gray-800 w-14 h-14 p-px rounded-lg hover:bg-gray-700 duration-200 overflow-hidden flex items-center justify-center"
        @click="$emit('click', $event)"
    >
        <img
            v-if="imgSrc"
            :src="imgSrc"
            :alt="imgAlt"
            class="w-full h-full rounded-lg object-cover block"
        />
        <FontAwesomeIcon v-else-if="icon" :icon="icon" :class="iconClass" />
        <slot v-else />
    </button>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

defineProps({
    imgSrc: {
        type: String,
        default: null
    },
    imgAlt: {
        type: String,
        default: ''
    },
    icon: {
        type: String,
        default: null
    },
    iconClass: {
        type: String,
        default: 'text-indigo-600 hover:text-indigo-500 text-2xl duration-200'
    }
});

defineEmits(['click']);
</script>
