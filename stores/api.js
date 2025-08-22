import { defineStore } from 'pinia'
import createAxiosInstance from './axios';
import { useUserStore } from './user';

export const useApiStore = defineStore('api', {
    state: () => ({
        urls: {
            backend: 'http://localhost:30001',
            ws: 'http://localhost:30001',
        }
    }),

    actions: {
        // User Informations
        async getUserPublicKey(userId) {
            const axiosInstance = createAxiosInstance();
            try {
                const response = await axiosInstance.get(`${this.urls.backend}/user/${userId}/publicKey`);
                return response.data.publicKey;
            } catch (error) {
                console.error("Error fetching user public key:", error);
                throw error;
            }
        },

        async getUsername(userId) {
            const axiosInstance = createAxiosInstance();
            try {
                const response = await axiosInstance.get(`${this.urls.backend}/user/${userId}/username`);
                return response.data.username;
            } catch (error) {
                console.error("Error fetching user username:", error);
                throw error;
            }
        },

        // Privates Discussion
        async getPrivateDiscussion(from, to) {
            const axiosInstance = createAxiosInstance();
            const userStore = useUserStore();

            try {
                const response = await axiosInstance.get(`${this.urls.backend}/message/${to}/messages`, {
                    headers: {
                        'Authorization': `Bearer ${userStore.token}`,
                        'x-user-id': from
                    }
                });
                return response.data;
            } catch (error) {
                console.error("Error fetching private discussion:", error);
                throw error;
            }
        }
    }
})