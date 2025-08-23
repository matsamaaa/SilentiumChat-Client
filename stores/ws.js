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
                this.isConnected = true;

                this.wsRegister(userId, token);
            });

            this.socket.on("disconnect", () => {
                this.isConnected = false;
            });

            this.socket.on("receiveMessage", async (msg) => {
                const webSocketStore = useWebSocketStore();
                
                const decryptedMessage = await decryptMessage(msg.encryptedMessage);
                const newMsg = { ...msg, encryptedMessage: decryptedMessage };

                const discussion = webSocketStore.messages.find(d =>
                    d.users.includes(msg.from) && d.users.includes(msg.to)
                );

                if (discussion) {
                    discussion.encryptedMessages.push(newMsg);
                } else {
                    webSocketStore.messages.push({
                        users: [msg.from, msg.to],
                        encryptedMessages: [newMsg]
                    });
                }
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

            const apiStore = useApiStore();
            const userStore = useUserStore();
            const webSocketStore = useWebSocketStore();

            // recipient message
            const publicKeyString = await apiStore.getUserPublicKey(to);
            const encryptedMessageBase64 = await encryptMessage(message, publicKeyString);

            // sender message
            const encryptedMessageBySenderBase64 = await encryptMessage(message, userStore.user.publicKey);

            this.socket.emit("sendMessage", { to, encryptedMessage: encryptedMessageBase64, encryptedMessageBySender: encryptedMessageBySenderBase64 });
            
            const messageData = {
                from: userStore.user.uniqueId,
                to,
                encryptedMessaged: encryptedMessageBase64,
                encryptedMessageBySender: message,
                timestamp: new Date(),
            };

            const discussion = webSocketStore.messages.find(d =>
                d.users.includes(messageData.from) && d.users.includes(messageData.to)
            );

            if (discussion) {
                discussion.encryptedMessages.push(messageData);
            } else {
                webSocketStore.messages.push({
                    users: [messageData.from, messageData.to],
                    encryptedMessages: [messageData]
                });
            }
        }
    }
})