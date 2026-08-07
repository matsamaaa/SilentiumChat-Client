<template>
    <div
        :class="[
            deviceStore.isTablet ? 'w-[30vw]' : '', 
            deviceStore.isMobile ? 'w-[85vw]' : '',
            deviceStore.isDesktop ? 'w-[13vw]' : ''
        ]"
        class="shadow-xl/30 h-[94vh] bg-gray-900 flex flex-col gap-2 border-r border-b border-gray-800 rounded-br-lg flex-shrink-0">
        <ServerBannerContent :name="server?.name" :banner="server?.banner" @settings-click="handleServerSettings" />
        <ChannelButton label="Create Channel" @execute="navigationStore.goToChannelCreation(code)" />
    
        <br>
        <p class="ml-2 text-sm text-gray-400">channels</p>
        <ChannelButton
            v-for="channel in server.channels"
            :key="channel.id"
            :label="channel.name"
            @execute="navigationStore.goToChannel(code, channel.id)"
            />
    </div>
    <ServerUpdateWidget v-if="settingsClicked" @close="handleServerSettings" />
</template>

<script setup>
import { useDeviceStore, useServersStore, useNavigationStore, useNotificationStore } from '#imports';
import ServerBannerContent from '~/components/features/server/ServerBannerContent.vue';
import ChannelButton from '~/components/ui/buttons/ChannelButton.vue';
import ServerUpdateWidget from '~/components/features/server/ServerUpdateWidget.vue';

const deviceStore = useDeviceStore();
const serversStore = useServersStore();
const navigationStore = useNavigationStore();
const notificationStore = useNotificationStore();

const route = useRoute();
const code = route.params.code;

const server = computed(() => {
    return serversStore.getServerByCode(code);
});

const emit = defineEmits(['settings-click']);

onMounted(() => {
    if (!server.value) {
        notificationStore.add('error', 'Server not found');
        navigationStore.goToHome();
    }
});

const settingsClicked = ref(false);

const handleServerSettings = () => {
    settingsClicked.value = !settingsClicked.value;
}
</script>