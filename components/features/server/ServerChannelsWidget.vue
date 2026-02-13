<template>
    <div
        :class="[
            deviceStore.isTablet ? 'w-[30vw]' : '', 
            deviceStore.isMobile ? 'w-[85vw]' : '',
            deviceStore.isDesktop ? 'w-[13vw]' : ''
        ]"
        class="shadow-xl/30 h-[94vh] bg-gray-900 flex flex-col gap-2 border-r border-b border-gray-800 rounded-br-lg flex-shrink-0">
        <div
            class="bg-indigo-600 text-white rounded-b-lg hover:bg-indigo-500 transition duration-150 shadow-md w-full h-32 overflow-hidden relative p-0"
            @click="openFileDialog"
        >
            <h2 class="absolute top-1 left-3 z-10 font-bold text-lg bg-gray-900/60 px-2 rounded w-fit">{{ server?.name }}</h2>
            <img v-if="server?.banner" :src="server?.banner" alt="Server Banner Preview" class="absolute inset-0 w-full h-full object-cover block"/>
        </div>
    </div>
</template>

<script setup>
import { useDeviceStore, useServersStore, useNavigationStore, useNotificationStore } from '#imports';

const deviceStore = useDeviceStore();
const serversStore = useServersStore();
const navigationStore = useNavigationStore();
const notificationStore = useNotificationStore();

const route = useRoute();

const server = computed(() => {
    const code = route.params.code;
    return serversStore.getServerByCode(code);
});

onMounted(() => {
    if (!server.value) {
        notificationStore.add('error', 'Server not found');
        navigationStore.goToHome();
    }
});
</script>