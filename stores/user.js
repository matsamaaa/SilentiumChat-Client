import { defineStore } from 'pinia'
import { useCookie } from '#app'

async function getPrivateKeyFromDB() {
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

        clearUser() {
            this.user = null
            this.token = null
            this.privateKey = null
            useCookie('user').value = null
            useCookie('token').value = null
        },
    }
});