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
            <button
                @click="navigationStore.goToHome"
                class="bg-gray-800 flex flex-col justify-center items-start p-4 rounded-lg hover:bg-gray-700 duration-200">
                <FontAwesomeIcon icon="fa-solid fa-message" class="text-indigo-600 hover:text-indigo-500 text-2xl duration-200"/>
            </button>
            
            <button
                @click="navigationStore.goToServerCreation"
                class="bg-gray-800 flex flex-col justify-center items-start p-4 rounded-lg hover:bg-gray-700 duration-200">
                <FontAwesomeIcon icon="fa-solid fa-server" class="text-indigo-600 hover:text-indigo-500 text-2xl duration-200"/>
            </button>
        </div>
    </div>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useNavigationStore } from '#imports';

import { useDeviceStore } from '#imports';

const navigationStore = useNavigationStore();
const deviceStore = useDeviceStore();
</script>