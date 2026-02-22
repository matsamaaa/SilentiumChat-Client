<template>
    <div
        :class="[
            deviceStore.isTablet ? 'w-[30vw]' : '', 
            deviceStore.isMobile ? 'w-[85vw]' : '',
            deviceStore.isDesktop ? 'w-[13vw]' : ''
        ]"
        class="shadow-xl/30 h-[94vh] bg-gray-900 flex flex-col gap-2 border-r border-b border-gray-800 rounded-br-lg flex-shrink-0">
            <p v-for="member in server.members" :key="member">{{ member }} {{ statusStore.getStatusByUserId(member) }}</p>
    </div>
</template>

<script setup>
import { useDeviceStore, useServersStore, useNavigationStore, useNotificationStore, useStatusStore } from '#imports';

const deviceStore = useDeviceStore();
const serversStore = useServersStore();
const navigationStore = useNavigationStore();
const notificationStore = useNotificationStore();
const statusStore = useStatusStore();

const route = useRoute();
const code = route.params.code;

const server = computed(() => {
    return serversStore.getServerByCode(code);
});

onMounted(() => {
    if (!server.value) {
        notificationStore.add('error', 'Server not found');
        return navigationStore.goToHome();
    }

    const statusStore = useStatusStore();
    server.members.map(async m => {
        await statusStore.initializeStatus(m);
    })
});
</script>