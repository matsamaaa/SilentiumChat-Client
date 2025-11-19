<template>
    <div class="flex items-center space-x-4">
      <AvatarIcon :user-id="userId" :username="username" />
        
        <div class="flex flex-col">
            <p class="text-lg font-semibold text-indigo-600 truncate max-w-xs">
                {{ username }}
            </p>
            
            <p v-if="createdAt" class="text-sm text-gray-500 mt-0.5">
                <span v-if="listType === 'accepted'">Ami depuis le {{ formatDate(createdAt) }}</span>
                <span v-else-if="listType === 'pending'">Demande envoyée le {{ formatDate(createdAt) }}</span>
            </p>
        </div>
    </div>
</template>

<script setup>
import AvatarIcon from '@/components/users/AvatarIcon.vue';
import { formatDate } from '@/utils/date.js';

const props = defineProps({
    username: {
        type: String,
        required: true
    },
    createdAt: {
        type: [String, Date],
        required: false
    },
    userId: {
        type: String,
        required: false
    },
    listType: {
        type: String,
        required: false
    }
});
</script>