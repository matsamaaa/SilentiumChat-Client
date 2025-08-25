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
        },

        async getUserIdByFullName(username, code) {
            const axiosInstance = createAxiosInstance();
            try {
                const response = await axiosInstance.get(`${this.urls.backend}/user/${username}/${code}/id`);
                return response.data.userId;
            } catch (error) {
                console.error("Error fetching user ID by full name:", error);
                throw error;
            }
        },

        async postFile(to, fileData) {
            const axiosInstance = createAxiosInstance();
            const formData = new FormData();
            
            formData.append("file", fileData.encryptedData);
            formData.append("to", to);
            formData.append("iv", fileData.iv);
            formData.append("authTag", fileData.authTag);
            formData.append("encryptedKey", fileData.encryptedKey);
            formData.append("encryptedKeySender", fileData.encryptedKeySender);

            try {
                const response = await axiosInstance.post(
                    `${this.urls.backend}/files/upload`, 
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        },
                        onUploadProgress: (progressEvent) => {
                            const { loaded, total } = progressEvent;
                            const percent = Math.round((loaded * 100) / total);
                            console.log(`File upload progress: ${percent}%`);
                        }
                    }
                );
                return response.data;
            } catch (error) {
                console.error("Error posting file:", error);
                throw error;
            }
        }
    }
})