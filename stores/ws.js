import { defineStore } from 'pinia'
import { useApiStore } from './api'
import { io } from 'socket.io-client';
import { encryptMessage } from '~/utils/messages';

export const useWebSocketStore = defineStore('websocket', {
    state: () => ({
        socket: null,
        messages: [],
        isConnected: false
    }),

    getters: {
        getMessages() {
            return this.messages;
        }
    },

    actions: {
        connect(userId, token) {
            const apiStore = useApiStore();

            // connexion socket.io
            this.socket = io(apiStore.urls.ws, {
                transports: ["websocket"], // force WebSocket
            });

            this.socket.on("connect", () => {
                console.log("websocket connected: ", this.socket.id);
                this.isConnected = true;

                this.wsRegister(userId, token);
            });

            this.socket.on("disconnect", () => {
                console.log("websocket disconnected");
                this.isConnected = false;
            });

            this.socket.on("receiveMessage", (msg) => {
                console.log("new message", msg);
                this.messages.push(msg);
            });
        },

        wsDisconnect() {
            if (!this.socket) return;
            this.socket.disconnect();
        },

        wsRegister(userId, userToken) {
            if (!this.socket) return;
            this.socket.emit("register", { userId, userToken });
        },

        async wsSendMessage(to, message) {
            if (!this.socket) return;

            const encryptedMessageBase64 = await encryptMessage(to, message);

            this.socket.emit("sendMessage", { to, encryptedMessage: encryptedMessageBase64 });
            this.messages.push({ to, encryptedMessage: message });
        }
    }
})