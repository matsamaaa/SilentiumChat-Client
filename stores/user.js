import { defineStore } from 'pinia'
import { useCookie } from '#app'
import axiosInstance from './axios';
import { useApiStore } from './api';
import generateKeyPair from '~/utils/keys';

const apiStore = useApiStore();

const getPrivateKeyFromDB = async () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("SilentiumDB", 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains("keys")) {
                db.createObjectStore("keys");
            }
        };

        request.onsuccess = () => {
            const db = request.result;
            const tx = db.transaction("keys", "readonly");
            const store = tx.objectStore("keys");
            const getRequest = store.get("privateKey");

            getRequest.onsuccess = () => resolve(getRequest.result);
            getRequest.onerror = () => reject(getRequest.error);
        };

        request.onerror = () => reject(request.error);
    });
}

const setPrivateKeyInDB = async (privateKey) => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("SilentiumDB", 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains("keys")) {
                db.createObjectStore("keys");
            }
        };

        request.onsuccess = () => {
            const db = request.result;
            const tx = db.transaction("keys", "readwrite");
            const store = tx.objectStore("keys");
            const putRequest = store.put(privateKey, "privateKey");

            putRequest.onsuccess = () => resolve();
            putRequest.onerror = () => reject(putRequest.error);
        };

        request.onerror = () => reject(request.error);
    });
}

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
            const privateKey = await getPrivateKeyFromDB();

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
            await setPrivateKeyInDB(privateKey);
        },

        clearUser() {
            this.user = null
            this.token = null
            this.privateKey = null
            useCookie('user').value = null
            useCookie('token').value = null
        },

        async register(email, username, tag, password, passwordConfirmation) {
            const { publicKey, privateKey } = await generateKeyPair();

            const response = await axiosInstance.post(`${apiStore.urls.backend}/auth/register`, {
                email,
                username,
                tag,
                password,
                passwordConfirmation,
                publicKey,
            });

            if (response.status === 201) {
                const { token, user } = response.data;
                this.updateToken(token);
                this.updateUser(user);
                await this.updatePrivateKey(privateKey);
            } else {
                throw new Error(response.data.message);
            }
        },

        async login(email, password) {
            const response = await axiosInstance.post(`${apiStore.urls.backend}/auth/login`, {
                email,
                password
            });

            if (response.status === 200) {
                const { token, user } = response.data;
                this.updateToken(token);
                this.updateUser(user);
            } else {
                throw new Error(response.data.message);
            }
        }
    }
});