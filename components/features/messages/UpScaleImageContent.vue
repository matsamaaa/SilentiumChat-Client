<template>
    <div class="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">

        <div class="absolute top-4 right-4 flex space-x-4 text-white text-2xl">

            <DownloadIcon :url="url" :filename="alt" />
            <QuitIcon @execute="$emit('close')" />

        </div>

        <img 
            :src="url" 
            :alt="alt" 
            class="max-w-full max-h-full rounded shadow-lg"
        />

    </div>
</template>

<script setup>
import DownloadIcon from '~/components/ui/icons/DownloadIcon.vue';
import QuitIcon from '~/components/ui/icons/QuitIcon.vue';

const props = defineProps({
    url: {
        type: String,
        required: true
    },
    alt: {
        type: String,
        required: true
    }
});

const emit = defineEmits(['close']);
</script>