<template>
    <div
        class="bg-indigo-600 text-white rounded-b-lg hover:bg-indigo-500 transition duration-150 shadow-md w-full h-32 overflow-hidden relative p-0"
    >
        <h2 class="absolute top-1 left-3 z-10 font-bold text-lg bg-gray-900/60 px-2 rounded w-fit">{{ name }}</h2>
        <img v-if="banner" :src="banner" alt="Server Banner Preview" class="absolute inset-0 w-full h-full object-cover block"/>

        <FontAwesomeIcon @click="onSettingsClick" icon="gear" class="absolute top-2 right-2 text-white hover:text-indigo-300 transition duration-150 hover:rotate-180 cursor-pointer" />
    </div>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

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

const emit = defineEmits(['settings-click']);

const onSettingsClick = () => {
    emit('settings-click');
}
</script>