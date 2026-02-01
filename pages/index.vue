<template>
    <div class="flex flex-row">
        <DiscussionsWidget />
        <FriendsTabContent v-if="!deviceStore.isMobile" />
    </div>
</template>

<script setup>
import FriendsTabContent from '~/components/features/friends/FriendsTabWidget.vue';
import DiscussionsWidget from '~/components/features/DiscussionsWidget.vue';

import { useDeviceStore } from '@/stores/device';

const deviceStore = useDeviceStore();
</script>