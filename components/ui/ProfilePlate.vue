<template>
    <div 
        :class="[
            deviceStore.isTablet ? 'w-[40vw]' : '', 
            deviceStore.isMobile ? 'w-[100vw]' : '',
            deviceStore.isDesktop ? 'w-[18vw]' : ''
        ]"
        class="h-[6vh] bg-gray-900 absolute bottom-0 left-0 z-50 border-t border-r rounded-r-lg border-gray-800 flex items-center justify-between p-2 flex-row">
        <div class="flex flex-row justify-start items-center">
            <AvatarIcon />
            <div class="flex flex-col">
                <p class="pl-4 text-indigo-600 text-lg">{{ username }}</p>
                <p class="pl-4 text-gray-500 text-sm">#{{ tag }}</p>
            </div>
        </div>
        <StatusIcon :me="true" />
        <div class="flex flex-row">
            <FontAwesomeIcon
                @click="navigationStore.goToSettings"
                icon="fa-solid fa-gear" 
                class="pl-4 text-gray-500 text-sm cursor-pointer" />
            <FontAwesomeIcon
                @click="userStore.logout"
                icon="fa-solid fa-arrow-right-from-bracket" 
                class="pl-4 text-red-500 text-sm cursor-pointer" />
        </div>
    </div>
</template>

<script setup>
import AvatarIcon from '~/components/ui/icons/AvatarIcon.vue';
import StatusIcon from './icons/StatusIcon.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import { useUserStore, useNavigationStore, useDeviceStore } from '#imports';

const userStore = useUserStore();
const navigationStore = useNavigationStore();
const deviceStore = useDeviceStore();

const username = computed(() => userStore.user.username || 'unknown');
const tag = computed(() => userStore.user.tag.toString().padStart(4, '0') || '');
</script>