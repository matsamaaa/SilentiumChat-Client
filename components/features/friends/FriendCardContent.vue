<template>
    <div class="flex items-center space-x-4">

        <AvatarIcon
            :userId="props.userId"
            :username="props.username"
            />

        <div class="flex flex-col">
            <p class="text-lg font-semibold text-indigo-600 truncate max-w-xs">{{ props.username }}</p>

            <p
                :class="{
                    'text-xs': deviceStore.isMobile,
                    'text-sm': !deviceStore.isMobile
                }"
                class="text-sm text-gray-500 mt-0.5">
                
                {{ 
                    deviceStore.isMobile && tab != 'blocked' ? formatDate(props.createdAt) :
                    tab === 'accepted' ? `Friends since the ${formatDate(props.createdAt)}` :
                    tab === 'pending' ? `Request sent on ${formatDate(props.createdAt)}` :
                    ''
                }}

            </p>
        </div>
    </div>
</template>

<script setup>
import AvatarIcon from '~/components/ui/icons/AvatarIcon.vue';
import { formatDate } from '@/utils/date.js';

import { useDeviceStore } from '@/stores/device';

const deviceStore = useDeviceStore();

const props = defineProps({
    userId: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    createdAt: {
        type: [String, Date],
        required: true
    },
    tab: {
        type: String,
        required: true
    }
});
</script>