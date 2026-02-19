<template>
    <div
        :class="[
            deviceStore.isTablet ? 'w-[30vw]' : '', 
            deviceStore.isMobile ? 'w-[85vw]' : '',
            deviceStore.isDesktop ? 'w-[13vw]' : ''
        ]"
        class="shadow-xl/30 h-[94vh] bg-gray-900 flex flex-col gap-2 border-r border-b border-gray-800 rounded-br-lg flex-shrink-0">
        <ServerBannerContent :name="server?.name" :banner="server?.banner" />
        <ChannelButton label="Create Channel" @execute="navigationStore.goToChannelCreation(code)" />
    
        <br>
        
        <ChannelButton
            v-for="channel in server.channels"
            :key="channel.id"
            :label="channel.name"
            />
    </div>
</template>

<script setup>
import { useDeviceStore, useServersStore, useNavigationStore, useNotificationStore } from '#imports';
import ServerBannerContent from '~/components/features/server/ServerBannerContent.vue';
import ChannelButton from '~/components/ui/buttons/ChannelButton.vue';

const deviceStore = useDeviceStore();
const serversStore = useServersStore();
const navigationStore = useNavigationStore();
const notificationStore = useNotificationStore();

const route = useRoute();
const code = route.params.code;

const server = computed(() => {
    return serversStore.getServerByCode(code);
});

onMounted(() => {
    if (!server.value) {
        notificationStore.add('error', 'Server not found');
        navigationStore.goToHome();
    }
});
</script>