<template>
    <div 
        v-if="waitingDiscussions.length > 0"
        @click="goToWaitingMessages"
        class="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors duration-200"
    >
        <div class="flex flex-col">
            <p class="font-semibold text-white">messages requests ({{ waitingDiscussions.length }})</p>
        </div>
    </div>
</template>

<script setup>
import { useNavigationStore } from '@/stores/navigation'
const props = defineProps({
    waitingDiscussions: { type: Array, required: true }
})

const navigationStore = useNavigationStore();

const goToWaitingMessages = () => {
    // Logic to navigate to waiting messages
    navigationStore.goToWaitingMessages();
}
</script>