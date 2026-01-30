<template>
    <div class="flex flex-row">
        <MessagingSideBar />
        <FriendTab v-if="!deviceStore.isMobile" />
    </div>
</template>

<script setup>
import { useDeviceStore } from '@/stores/device';
import FriendTab from '~/components/tabs/FriendTab.vue';
import MessagingSideBar from '~/components/sidebars/MessagingSideBar.vue';

const deviceStore = useDeviceStore();
</script>