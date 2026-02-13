<template>
    <div 
        :class="[
            deviceStore.isTablet ? 'w-[10vw]' : '', 
            deviceStore.isMobile ? 'w-[15vw]' : '',
            deviceStore.isDesktop ? 'w-[5vw]' : '',
            deviceStore.isDisabledMessagesBar && deviceStore.isMobile ? 'h-[100vh]' : 'h-[94vh]'
        ]"
        class="bg-gray-900 flex flex-col items-center py-4 border-r border-gray-800">

        <div class="flex flex-col gap-2">
            <SquareIconButton icon="fa-solid fa-message" @click="navigationStore.goToHome" />
            
            <SquareIconButton icon="fa-solid fa-server" @click="navigationStore.goToServerCreation" />
            
            <hr class="border-gray-700">

            <SquareIconButton
                v-for="(server, code) in serversStore.servers"
                :key="code"
                :img-src="server.icon"
                img-alt="Server Icon"
                icon="fa-solid fa-server"
                @click="navigationStore.goToServer(code)"
            >
            </SquareIconButton>
        </div>
    </div>
</template>

<script setup>
import SquareIconButton from '~/components/ui/buttons/SquareIconButton.vue';
import { useNavigationStore, useServersStore } from '#imports';

import { useDeviceStore } from '#imports';

const navigationStore = useNavigationStore();
const serversStore = useServersStore();
const deviceStore = useDeviceStore();
</script>