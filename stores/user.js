import { defineStore } from 'pinia'
import { useCookie } from '#app'
import createAxiosInstance from './axios';
import { useApiStore } from './api';
import { useNavigationStore } from './navigation';
import { useWebSocketStore } from './ws';
import { getPrivateKeyFromDB, setPrivateKeyInDB } from '~/utils/keys/rsa';
import { generateRSAKeyPair } from '~/utils/keys/rsa';
import { bufferToBase64 } from '~/utils/conversion';

export const useUserStore = defineStore('user', {
    state: () => ({
        token: null,
        user: null,
        privateKey: null,
        initialized: false
    }),

    getters: {
        isLoggedIn: (state) => !!state.token,
        getUser: (state) => state.user,
    },

    actions: {
        async initialize() {
            const token = useCookie('token');
            const user = useCookie('user');
            const privateKey = await getPrivateKeyFromDB(user.value.uniqueId);

            if (token) {
                this.token = token;
            }

            if (user) {
                this.user = typeof user.value === 'string'
                    ? JSON.parse(user.value)
                    : user.value || null
            }

            if (privateKey) {
                this.privateKey = privateKey;
            }

            this.initialized = true;
        },

        updateUser(user) {
            this.user = user
            useCookie('user').value = JSON.stringify(user)
        },

        updateToken(token) {
            this.token = token
            useCookie('token').value = token
        },

        async updatePrivateKey(privateKey) {
            this.privateKey = privateKey
            await setPrivateKeyInDB(privateKey, this.user.uniqueId);
        },

        clearUser() {
            this.user = null
            this.token = null
            this.privateKey = null
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

                if (response.status === 201) {
                    const { token, user } = response.data;
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

            if (response.status === 200) {
                const { token, user } = response.data;
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
        }
    }
});