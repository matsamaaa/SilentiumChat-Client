<template>
    <div class="relative flex flex-row w-full justify-between h-full">
        <div class="flex flex-col justify-between overflow-y-auto w-full">
            <MessageInput />
        </div>

        <transition name="slide-right">
            <div
                v-if="deviceStore.isDesktop || isUserBarVisible"
                :class="{
                    'absolute right-0 top-0 h-full z-10 w-[20vw]': deviceStore.isTablet,
                    'absolute right-0 top-0 h-full z-10 w-[85vw]': deviceStore.isMobile,

                }"
            >
                
            </div>
        </transition>
    </div>
</template>

<script setup>
import MessageInput from '~/components/features/messages/MessageInput.vue';

import { useDeviceStore } from '#imports';

const deviceStore = useDeviceStore();
</script>