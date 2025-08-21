import { defineStore } from 'pinia'

export const useApiStore = defineStore('api', {
    state: () => ({
        urls: {
            backend: 'http://localhost:30001',
        }
    }),

    actions: {
        
    }
})