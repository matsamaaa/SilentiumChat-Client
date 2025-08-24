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
        async getPrivateDiscussion(to) {
            const axiosInstance = createAxiosInstance();

            try {
                const response = await axiosInstance.get(`${this.urls.backend}/message/${to}/messages`);
                return response.data;
            } catch (error) {
                console.error("Error fetching private discussion:", error);
                throw error;
            }
        },

        async getLastMessages() {
            const axiosInstance = createAxiosInstance();

            try {
                const response = await axiosInstance.get(`${this.urls.backend}/message/lastmessages`);
                return response.data;
            } catch (error) {
                console.error("Error fetching last messages:", error);
                throw error;
            }
        }
    }
})