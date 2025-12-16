<template>
    <div class="flex flex-row">
        <MessagesBar />
        <FriendLayout v-if="!deviceStore.isMobile" />
    </div>
</template>

<script setup>
import MessagesBar from '~/components/pages/layouts/MessagesBar.vue';
import FriendLayout from '~/components/pages/layouts/FriendLayout.vue';

import { useDeviceStore } from '@/stores/device';

const deviceStore = useDeviceStore();
</script>