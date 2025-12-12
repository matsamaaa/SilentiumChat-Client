import { defineNuxtPlugin } from 'nuxt/app'
import { usePrivateDiscussionsStore } from '@/stores/privateDiscussions'

export default defineNuxtPlugin(() => {
    const privateDiscussions = usePrivateDiscussionsStore()
    privateDiscussions.initialize()
})
