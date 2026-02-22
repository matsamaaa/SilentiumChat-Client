<template>
    <div 
        :class="[
            deviceStore.isTablet ? 'w-[40vw]' : '', 
            deviceStore.isMobile ? 'w-[100vw]' : '',
            deviceStore.isDesktop ? 'w-[18vw]' : ''
        ]"
        class="h-[6vh] bg-gray-900 border-t border-r rounded-r-lg border-gray-800 flex items-center justify-between p-2 flex-row">
        <div class="flex flex-row justify-start items-center">
            <AvatarIcon
                :username="props.username"
                :src="props.avatarIconSrc" 
                :isBanner="false"
                />
            <p class="pl-4 text-indigo-600 text-lg">{{ props.username }}</p>
            <StatusIcon
                class="ml-4"
                :userId="props.userId"
                />
        </div>
    </div>
</template>

<script setup>
import AvatarIcon from '~/components/ui/icons/AvatarIcon.vue';
import StatusIcon from './icons/StatusIcon.vue';

import { useDeviceStore } from '#imports';

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
    avatarIconSrc: {
        type: String,
        required: false,
        default: null
    }
});

onMounted(() => {
    console.log('LittleProfilePlate props:', props);
    console.log('test')
});
</script>