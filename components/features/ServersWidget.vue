<template>
    <div 
        :class="[
            deviceStore.isTablet ? 'w-[10vw]' : '', 
            deviceStore.isMobile ? 'w-[15vw]' : '',
            deviceStore.isDesktop ? 'w-[5vw]' : '',
            deviceStore.isDisabledMessagesBar && deviceStore.isMobile ? 'h-[100vh]' : 'h-[94vh]'
        ]"
        class="bg-gray-900 flex flex-col items-center py-4 border-r border-gray-800">

        <div class="flex flex-col gap-2 w-full items-center">
            <SquareIconButton icon="fa-solid fa-message" @click="navigationStore.goToHome" />
            
            <SquareIconButton icon="fa-solid fa-server" @click="navigationStore.goToServerCreation" />
            
            <hr class="border-gray-700 w-2/4" />

            <div
                v-for="(server, code) in serversStore.servers"
                :key="code"
                class="relative w-full flex justify-center"
            >
                <span
                    v-if="isActiveServer(code)"
                    class="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-8 bg-indigo-600 rounded-r-full"
                />
                <SquareIconButton
                    :img-src="server.icon"
                    img-alt="Server Icon"
                    icon="fa-solid fa-server"
                    @click="navigationStore.goToServer(code)"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import SquareIconButton from '~/components/ui/buttons/SquareIconButton.vue';
import { useNavigationStore, useServersStore } from '#imports';

import { useDeviceStore } from '#imports';

const route = useRoute();

const navigationStore = useNavigationStore();
const serversStore = useServersStore();
const deviceStore = useDeviceStore();

const isActiveServer = (code) => {
    const current = route.params?.code;
    if (!current || current !== code) return false;
    return !!serversStore.getServerByCode(current);
};
</script>