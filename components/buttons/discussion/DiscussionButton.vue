<template>
    <div 
        @click="!isWaiting ? navigationStore.goToWaitingMessages() : navigationStore.goToHome()"
        class="flex items-center justify-center rounded-lg cursor-pointer mx-2 py-2 hover:bg-gray-800 transition-colors duration-200"
    >
        <p v-if="!isWaiting" class="font-semibold text-white">messages requests ({{ discussionsLength }})</p>
        <p v-else class="font-semibold text-white">back to all messages</p>
    </div>
</template>

<script setup>
import { useNavigationStore } from '@/stores/navigation'

const props = defineProps({
    discussionsLength: { type: Number, required: false },
    isWaiting: { type: Boolean, default: false, required: true }
})

const navigationStore = useNavigationStore();
</script>