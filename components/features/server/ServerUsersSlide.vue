<template>
    <div
        class="relative flex flex-row w-full h-full"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
        @mouseleave="handleMouseLeave"
    >
        <slot />

        <!-- Arrow Users Slide -->
        <div
            v-if="!deviceStore.isDesktop && !isUsersBarVisible"
            class="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-800/50 p-2 rounded-l-lg animate-pulse"
        >
            <FontAwesomeIcon :icon="['fas', 'chevron-left']" class="h-6 w-6 text-white" />
        </div>

        <!-- Users -->
        <transition name="slide-right">
            <div
                v-if="deviceStore.isDesktop || isUsersBarVisible"
                :class="{
                    'absolute right-0 top-0 h-full z-10': !deviceStore.isDesktop,
                }"
            >
                <ServerUsersWidget />
            </div>
        </transition>
    </div>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useDeviceStore } from '#imports';

import ServerUsersWidget from '~/components/features/server/ServerUsersWidget.vue';

const deviceStore = useDeviceStore();
const route = useRoute();

const isMouseDown = ref(false);
const touchStartX = ref(0);
const touchEndX = ref(0);
const isUsersBarVisible = ref(false);

const handleMouseDown = (event) => {
    if (deviceStore.isDesktop) return;
    isMouseDown.value = true;
    touchStartX.value = event.clientX;
    touchEndX.value = 0;
};

const handleMouseMove = (event) => {
    if (deviceStore.isDesktop || !isMouseDown.value) return;
    touchEndX.value = event.clientX;
};

const handleMouseUp = () => {
    if (deviceStore.isDesktop || !isMouseDown.value) return;
    isMouseDown.value = false;
    handleTouchEnd();
};

const handleMouseLeave = () => {
    if (isMouseDown.value) {
        handleMouseUp();
    }
};

const handleTouchStart = (event) => {
    if (deviceStore.isDesktop) return;
    touchStartX.value = event.touches[0].clientX;
    touchEndX.value = 0;
};

const handleTouchMove = (event) => {
    if (deviceStore.isDesktop) return;
    touchEndX.value = event.touches[0].clientX;
};

const handleTouchEnd = () => {
    if (deviceStore.isDesktop || !touchEndX.value) return;

    const diff = touchStartX.value - touchEndX.value;
    const minSwipeDistance = 50;

    if (Math.abs(diff) > minSwipeDistance) {
        if (diff > 0) {
            isUsersBarVisible.value = true;
        } else {
            isUsersBarVisible.value = false;
        }
    }

    touchStartX.value = 0;
    touchEndX.value = 0;
};

watch(
    () => route.fullPath,
    () => {
        if (!deviceStore.isDesktop) {
            isUsersBarVisible.value = false;
        }
    }
);
</script>
