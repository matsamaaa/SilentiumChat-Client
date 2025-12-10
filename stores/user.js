import { defineStore } from 'pinia'
import { useCookie } from '#app'
import createAxiosInstance from './axios';
import { useApiStore } from './api';
import { useNavigationStore } from './navigation';
import { useWebSocketStore } from './ws';
import { getPrivateKeyFromDB, setPrivateKeyInDB } from '~/utils/keys/rsa';
import { generateRSAKeyPair } from '~/utils/keys/rsa';
import { bufferToBase64 } from '~/utils/conversion';
import { useNotificationStore } from './notifications';

export const useUserStore = defineStore('user', {
    state: () => ({
        token: null,
        user: null,
        initialized: false,
        avatar: null,
        friends: {
            accepted: [],
            pending: [],
            blocked: []
        },
    }),

    getters: {
        isLoggedIn: (state) => !!state.token,
        getUser: (state) => state.user,
    },

    actions: {
        async initialize() {
            const token = useCookie('token');
            const user = useCookie('user');
            const apiStore = useApiStore();

            if (token.value) {
                this.token = token;
            }

            if (user.value) {
                this.user = typeof user.value === 'string'
                    ? JSON.parse(user.value)
                    : user.value || null

                await apiStore.getAvatar();
            }

            if (user.value) {
                const friendStatus = ['accepted', 'pending', 'blocked'];
                for (const status of friendStatus) {
                    const friendsList = await apiStore.getFriendsList(status);
                    friendsList.forEach(friend => {
                        this.addFriend(friend, status);
                    });
                }
            }

            this.initialized = true;
        },

        updateUser(user) {
            this.user = user
            useCookie('user').value = JSON.stringify(user)
        },

        updateUsername(newUsername) {
            if (this.user) {
                this.user.username = newUsername;
                useCookie('user').value = JSON.stringify(this.user);
            }
        },

        updateTag(newTag) {
            if (this.user) {
                this.user.tag = newTag;
                useCookie('user').value = JSON.stringify(this.user);
            }
        },

        updateAvatar(newAvatar) {
            if (this.user) {
                this.user.avatar = newAvatar;
                useCookie('user').value = JSON.stringify(this.user);
            }
        },

        updateToken(token) {
            this.token = token
            useCookie('token').value = token
        },

        async updatePrivateKey(privateKey) {
            await setPrivateKeyInDB(privateKey, this.user.uniqueId);
            const notif = useNotificationStore();
            notif.add("Private key updated successfully", "success");
        },

        async getPrivateKey() {
            if (this.user) {
                const privateKey = await getPrivateKeyFromDB(this.user.uniqueId);
                return privateKey;
            }
        },

        clearUser() {
            this.user = null
            this.token = null
            this.avatar = null
            this.friends = {
                accepted: [],
                pending: [],
                blocked: []
            };
            useCookie('user').value = null
            useCookie('token').value = null
        },

        async register(email, username, tag, password, passwordConfirmation) {
            const apiStore = useApiStore();
            const navigationStore = useNavigationStore();
            const webSocketStore = useWebSocketStore();
            const { publicKey, privateKey } = await generateRSAKeyPair(); // buffer

            const publicKeyBase64 = bufferToBase64(publicKey);
            const privateKeyBase64 = bufferToBase64(privateKey);
            const axiosInstance = createAxiosInstance();
            try {
                const response = await axiosInstance.post(`${apiStore.urls.backend}/auth/register`, {
                    email,
                    username,
                    tag,
                    password,
                    passwordConfirmation,
                    publicKey: publicKeyBase64,
                });

                if (response.data.success) {
                    const { token, user } = response.data.datas;
                    this.updateToken(token);
                    this.updateUser(user);
                    await this.updatePrivateKey(privateKeyBase64);

                    webSocketStore.connect(user.uniqueId, token);
                    navigationStore.goToHome();
                }
            } catch (err) {
                if (err.response && err.response.data && err.response.data.message) {
                    throw new Error(err.response.data.message);
                } else {
                    throw new Error("Une erreur est survenue.");
                }
            }
        },

        async login(email, password) {
            const apiStore = useApiStore();
            const navigationStore = useNavigationStore();
            const webSocketStore = useWebSocketStore();

            const axiosInstance = createAxiosInstance();
            const response = await axiosInstance.post(`${apiStore.urls.backend}/auth/login`, {
                email,
                password
            });

            if (response.data.success) {
                const { token, user } = response.data.datas;
                this.updateToken(token);
                this.updateUser(user);

                const privateKey = await getPrivateKeyFromDB(user.uniqueId);
                this.updatePrivateKey(privateKey);

                webSocketStore.connect(user.uniqueId, token);
                navigationStore.goToHome();
            } else {
                throw new Error(response.data.message);
            }
        },

        async logout() {
            const webSocketStore = useWebSocketStore();
            const navigationStore = useNavigationStore();

            this.clearUser();
            webSocketStore.wsDisconnect();
            navigationStore.goToLogin();
        },

        /**
         * Friend management actions
         */

        createFriendObject(friendId, username, hasAsk = true) {
            return {
                createdAt: new Date(),
                userId: friendId,
                hasAsk: hasAsk,
                username: username,
            };
        },

        addFriend(friend, status = 'accepted', ask) {
            if (status === 'pending' && ask) {
                friend.hasAsk = ask;
            }

            this.friends[status].push(friend);
        },

        removeFriend(friendId) {
            const friendsStatus = ['accepted', 'pending', 'blocked'];
            friendsStatus.map(status => {
                this.friends[status] = this.friends[status].filter(user => user.userId !== friendId);
            });
        },

        getFriendStatus(friendId) {
            const friendsStatus = ['accepted', 'pending', 'blocked'];
            for (const status of friendsStatus) {
                const friend = this.friends[status].find(user => user.userId === friendId);
                if (friend) {
                    return {
                        ...friend,
                        status: status
                    };
                }
            }
            
            return null;
        },
    }
});