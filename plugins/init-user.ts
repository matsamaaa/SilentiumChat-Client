import { defineNuxtPlugin } from 'nuxt/app'
import { useUserStore } from '@/stores/user'

export default defineNuxtPlugin(() => {
    const userStore = useUserStore()
    userStore.initialize()
})
