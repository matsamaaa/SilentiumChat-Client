import { defineStore } from 'pinia'
import createAxiosInstance from './axios';

export const useApiStore = defineStore('api', {
    state: () => ({
        urls: {
            backend: 'http://localhost:30001',
            ws: 'http://localhost:30001',
        }
    }),

    actions: {
        async getUserPublicKey(userId) {
            const axiosInstance = createAxiosInstance();
            try {
                const response = await axiosInstance.get(`${this.urls.backend}/user/${userId}/publicKey`);
                return response.data.publicKey;
            } catch (error) {
                console.error("Error fetching user public key:", error);
                throw error;
            }
        }
    }
})