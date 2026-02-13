import { defineNuxtPlugin } from 'nuxt/app'
import { useUserStore, useServersStore } from '#imports'

export default defineNuxtPlugin( () => {
    const userStore = useUserStore();
    const serversStore = useServersStore();

    userStore.initialize();
    serversStore.initialize();
})
