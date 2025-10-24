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

        async postFile(fileData) {
            const axiosInstance = createAxiosInstance();
            const formData = new FormData();

            const file = new File([fileData.encryptedData], "file", { type: "application/octet-stream" });

            formData.append("file", file);
            formData.append("extension", fileData.extension);
            formData.append("iv", fileData.iv); // Uint8Array
            formData.append("authTag", fileData.authTag); // Uint8Array
            formData.append("encryptedKey", fileData.encryptedKey); // base64
            formData.append("encryptedKeySender", fileData.encryptedKeySender); // base64

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
        },

        async getFile(fileId) {
            const axiosInstance = createAxiosInstance();
            try {
                const response = await axiosInstance.get(`${this.urls.backend}/files/${fileId}`, {
                    responseType: 'arraybuffer',
                });

                // Convert ArrayBuffer en Uint8Array
                const fileBuffer = new Uint8Array(response.data);

                return fileBuffer;
            } catch (error) {
                console.error("Error fetching file:", error);
                throw error;
            }
        },

        async getFileMetadata(fileId) {
            const axiosInstance = createAxiosInstance();
            try {
                const response = await axiosInstance.get(`${this.urls.backend}/files/${fileId}/meta`);
                return response.data;
            } catch (error) {
                console.error("Error fetching file metadata:", error);
                throw error;
            }
        },

        async updateDiscussionStatus(to, status) {
            const axiosInstance = createAxiosInstance();
            try {
                const response = await axiosInstance.patch(`${this.urls.backend}/message/${to}/status`, { status });
                return response.data;
            } catch (error) {
                console.error("Error updating discussion status:", error);
                throw error;
            }
        },

        async updateUsername(newUsername) {
            const axiosInstance = createAxiosInstance();
            try {
                const response = await axiosInstance.patch(`${this.urls.backend}/me/username`, { username: newUsername });
                if (response.data.success) {
                    const userStore = useUserStore();
                    userStore.updateUsername(newUsername);
                }
                return response.data;
            } catch (error) {
                console.error("Error updating username:", error);
                throw error;
            }
        },

        async updateTag(newTag) {
            const axiosInstance = createAxiosInstance();
            try {
                const response = await axiosInstance.patch(`${this.urls.backend}/me/tag`, { tag: newTag });
                if (response.data.success) {
                    const userStore = useUserStore();
                    userStore.updateTag(newTag);
                }
                return response.data;
            } catch (error) {
                console.error("Error updating tag:", error);
                throw error;
            }
        },

        async uploadAvatar(file) {
            const axiosInstance = createAxiosInstance();
            const formData = new FormData();

            // 'avatar' doit correspondre au champ défini dans le backend (upload.single('avatar'))
            formData.append('avatar', file);

            try {
                const response = await axiosInstance.post(
                    `${this.urls.backend}/me/avatar`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        },
                        onUploadProgress: (progressEvent) => {
                            const { loaded, total } = progressEvent;
                            const percent = Math.round((loaded * 100) / total);
                            console.log(`Avatar upload progress: ${percent}%`);
                        }
                    }
                );

                if (response.data.success) {
                    const userStore = useUserStore();
                    // Si le backend renvoie l’URL publique du nouvel avatar
                    userStore.updateAvatar(response.data.avatarUrl);
                }

                return response.data;
            } catch (error) {
                console.error("Error uploading avatar:", error);
                throw error;
            }
        },

        async getAvatar(userId) {
            const axiosInstance = createAxiosInstance();
            const userStore = useUserStore();
            let url;
            if (userId) {
                url = `${this.urls.backend}/user/${userId}/avatar`;
            } else {
                url = `${this.urls.backend}/me/avatar`;
            }

            try {
                const response = await axiosInstance.get(url, {
                    responseType: 'arraybuffer',
                });

                if (response.status === 204) {
                    return null;
                }

                const contentType = response.headers['content-type'] || 'image/jpeg';
                const blob = new Blob([response.data], { type: contentType });
                const imageUrl = URL.createObjectURL(blob);
                
                if(!userId) userStore.avatar = imageUrl;
                return imageUrl;

            } catch (error) {
                if (error.response) {
                    return null; 
                } 
                
                throw error;
            }
        },

        async deleteAvatar() {
            const axiosInstance = createAxiosInstance();
            try {
                const response = await axiosInstance.delete(`${this.urls.backend}/me/avatar`);
                return response.data;
            } catch (error) {
                if (error.response) {
                    return null; 
                } 
                
                throw error;
            }
        },

        async getFriendStatus(userId) {
            const axiosInstance = createAxiosInstance();
            try {
                const response = await axiosInstance.get(`${this.urls.backend}/friends/${userId}/status`);
                return response.data;
            } catch (error) {
                console.error("Error fetching friend status:", error);
                throw error;
            }
        },

        async sendFriendRequest(userId) {
            const axiosInstance = createAxiosInstance();
            try {
                const response = await axiosInstance.post(`${this.urls.backend}/friends/${userId}/request`);
                return response.data;
            } catch (error) {
                console.error("Error sending friend request:", error);
                throw error;
            }
        },

        async acceptFriendRequest(userId) {
            const axiosInstance = createAxiosInstance();
            try {
                const response = await axiosInstance.post(`${this.urls.backend}/friends/${userId}/accept`);
                return response.data;
            } catch (error) {
                console.error("Error accepting friend request:", error);
                throw error;
            }
        },

        async refuseFriendRequest(userId) {
            const axiosInstance = createAxiosInstance();
            try {
                const response = await axiosInstance.post(`${this.urls.backend}/friends/${userId}/refuse`);
                return response.data;
            } catch (error) {
                console.error("Error refusing friend request:", error);
                throw error;
            }
        },

        async blockUser(userId) {
            const axiosInstance = createAxiosInstance();
            try {
                const response = await axiosInstance.post(`${this.urls.backend}/friends/${userId}/block`);
                return response.data;
            } catch (error) {
                console.error("Error blocking user:", error);
                throw error;
            }
        },

        async unblockUser(userId) {
            const axiosInstance = createAxiosInstance();
            try {
                const response = await axiosInstance.post(`${this.urls.backend}/friends/${userId}/unblock`);
                return response.data;
            } catch (error) {
                console.error("Error unblocking user:", error);
                throw error;
            }
        },

        async cancelFriendRequest(userId) {
            const axiosInstance = createAxiosInstance();
            try {
                const response = await axiosInstance.post(`${this.urls.backend}/friends/${userId}/cancel`);
                return response.data;
            } catch (error) {
                console.error("Error cancelling friend request:", error);
                throw error;
            }
        },

        async updatePassword(newPassword, passwordConfirmation, currentPassword) {
            const axiosInstance = createAxiosInstance();
            try {
                const response = await axiosInstance.patch(`${this.urls.backend}/me/password/update`, {
                    newPassword,
                    passwordConfirmation,
                    currentPassword
                });
                return response.data;
            } catch (error) {
                console.error("Error updating password:", error);
                throw error;
            }
        }
    }
})