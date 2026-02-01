<template>
    <div class="flex flex-row">
        <DiscussionsWidget
            v-if="!deviceStore.isDisabledMessagesBar"
            />
        <FriendsTabContent />
    </div>
</template>

<script setup>
import FriendsTabContent from '~/components/features/friends/FriendsTabWidget.vue';
import DiscussionsWidget from '~/components/features/DiscussionsWidget.vue';

import { useDeviceStore } from '@/stores/device';

const deviceStore = useDeviceStore();

watch(() => deviceStore.isMobile, (isMobile) => {
    deviceStore.isDisabledMessagesBar = isMobile;
});

onUnmounted(() => {
    deviceStore.isDisabledMessagesBar = false;
});

onMounted(async () => {
    if (deviceStore.isMobile) {
        deviceStore.isDisabledMessagesBar = true
    };
});
</script>