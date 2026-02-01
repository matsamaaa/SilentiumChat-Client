<template>
    <div 
        class="shadow-xl/30 w-[13vw] h-[100vh] bg-gray-900 flex flex-col border-r border-l border-gray-800 rounded-br-lg flex-shrink-0"
        :class="{
            'w-[85vw]': deviceStore.isMobile,
            'w-[20vw]': deviceStore.isTablet
        }"
        >
        <div class="w-full h-[13vh] bg-indigo-600 flex justify-end items-start pt-1">
            <FriendButtonChoiceContent
                :userId="id"
                :hasAsk="user.hasAsk"
                :tab="user.status"
                :isMessaging="true"
                />
        </div>
        
        <AvatarIcon 
            :userId="id" :username="username" :isBanner="true" 
            class="ml-3"   
            />

        <h1 class="ml-3 text-2xl -translate-y-4 text-white">{{ username }}</h1>
        <p class="ml-3 text-sm -translate-y-4 text-gray-500">{{ username }}#{{ tag }}</p>

        <br />
        
        <p class="ml-3 text-sm text-white font-bold">Member Since</p>
        <p class="ml-3 text-sm text-gray-500">{{ formatDate(creationDate) }}</p>
    </div>
</template>

<script setup>
import AvatarIcon from '~/components/ui/icons/AvatarIcon.vue'
import FriendButtonChoiceContent from '~/components/features/friends/FriendButtonChoiceContent.vue';
import { formatDate } from '~/utils/date.js';

import { useDeviceStore, useUserStore } from '#imports';

const deviceStore = useDeviceStore();
const userStore = useUserStore();

const props = defineProps({
    id: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        required: true
    },
    creationDate: {
        type: String,
        required: true
    }
});

const user = computed(() => userStore.getFriendStatus(props.id));
</script>
