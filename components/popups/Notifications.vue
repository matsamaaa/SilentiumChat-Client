<template>
    <div class="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
        <transition-group
            name="slide-fade"
            tag="div"
            class="flex flex-col gap-3"
        >
            <div
                v-for="notif in notificationStore.notifications"
                :key="notif.id"
                class="relative flex items-center justify-between gap-4 rounded-2xl shadow-xl px-5 py-3 min-w-[300px] max-w-sm text-white cursor-pointer transition-all duration-300 ease-out"
                :class="{
                'bg-red-600': notif.type === 'error',
                'bg-green-600': notif.type === 'success',
                'bg-blue-600': notif.type === 'info',
                }"
                @click="notificationStore.remove(notif.id)"
            >
                <FontAwesomeIcon :icon="getIcon(notif.type)" class="text-xs" />

                <p class="font-medium text-sm w-full break-words">
                    {{ notif.message }}
                </p>

                <button
                    @click.stop="notificationStore.remove(notif.id)"
                    class="flex-shrink-0 text-white opacity-90 hover:opacity-100 transition-opacity p-1 -m-1"
                    aria-label="Fermer la notification"
                >
                    <FontAwesomeIcon icon="fa-xmark" class="text-xs" />
                </button>
            </div>
        </transition-group>
    </div>
</template>

<script setup>
import { useNotificationStore } from '#imports';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const notificationStore = useNotificationStore();

const getIcon = (type) => {
    switch (type) {
        case 'success':
            return 'fa-circle-check';
        case 'error':
            return 'fa-circle-xmark';
        case 'info':
        default:
            return 'fa-circle-info';
    }
};
</script>