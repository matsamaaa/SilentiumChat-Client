import { defineStore } from 'pinia'
import { useApiStore } from './api'
import { io } from 'socket.io-client';
import { encryptMessage } from '~/utils/messages';
import { usePrivateDiscussionsStore } from './privateDiscussions';
import MessageManager from '~/utils/managers/messageManager';
import FileManager from '~/utils/managers/fileManager';

export const useWebSocketStore = defineStore('websocket', {
    state: () => ({
        socket: null,
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
                const privateDiscussionsStore = usePrivateDiscussionsStore();

                await privateDiscussionsStore.addMessageToDiscussion(msg);
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

        async wsSendMessage(to, message, file = null) {
            if (!this.socket) return;
            console.log("Sending message:", message, "with file:", file);
            const apiStore = useApiStore();
            const userStore = useUserStore();
            const privateDiscussionsStore = usePrivateDiscussionsStore();

            // recipient message
            const publicKeyString = await apiStore.getUserPublicKey(to);
            const encryptedMessageBase64 = await encryptMessage(message, publicKeyString);

            // sender message
            const encryptedMessageBySenderBase64 = await encryptMessage(message, userStore.user.publicKey);
            let fileData = null;

            if (file) {
                // keys
                const aesKey = await generateAESKey();
                // aesKey encrypt with RSAkey
                const encryptedAesKey = await encryptMessage(aesKey, publicKeyString);
                const encryptedKeySender = await encryptMessage(aesKey, userStore.user.publicKey);
                const iv = generateIVKey();

                const { encryptedData, authTag } = await encryptFile(file, aesKey, iv);
                fileData = new FileManager().createFile({
                    iv: bufferToBase64(iv),
                    authTag: bufferToBase64(authTag),

                    encryptedData: bufferToBase64(encryptedData),
                    encryptedKey: encryptedAesKey,
                    encryptedKeySender: encryptedKeySender
                });
            }

            this.socket.emit("sendMessage", { to, encryptedMessage: encryptedMessageBase64, encryptedMessageBySender: encryptedMessageBySenderBase64, file: fileData });

            // add message to local store
            const messageData = new MessageManager().createMessage(
                userStore.user.uniqueId,
                to,
                encryptedMessageBase64,
                encryptedMessageBySenderBase64,
                publicKeyString,
                userStore.user.publicKey
            );
            await privateDiscussionsStore.addMessageToDiscussion(messageData);
        }
    }
})