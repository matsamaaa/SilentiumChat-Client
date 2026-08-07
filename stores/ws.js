import { defineStore } from 'pinia'
import { useApiStore } from './api'
import { io } from 'socket.io-client';
import { encryptMessage } from '~/utils/messages';
import { usePrivateDiscussionsStore } from './privateDiscussions';
import { useStatusStore } from './status';
import { useUserStore } from './user';
import { encryptFile } from '~/utils/files';
import MessageManager from '~/utils/managers/messageManager';
import FileManager from '~/utils/managers/fileManager';
import { encryptAesKeyWithRSA, generateAESKey, generateIVKey } from '~/utils/keys/aes';


import { getFileExtension } from '~/utils/conversion.js';

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

            this.socket.on("userStatus", async (data) => {
                const statusStore = useStatusStore();
                const userId = data?.userId || data?.from;
                const status = data?.status;
                if (!userId) return;
                statusStore.updateStatus(userId, status);
            })

        },

        wsUpdateUserStatus(status) {
            if (!this.socket) return;
            this.socket.emit('updateUserStatus', { status });
        },

        wsDisconnect() {
            if (!this.socket) return;
            this.socket.disconnect();
        },

        wsRegister(userId, userToken) {
            if (!this.socket) return;
            this.socket.emit("register", { userId, userToken });
        },

        wsClear() {
            this.wsDisconnect();
            this.socket = null;
            this.isConnected = false;
        },

        async wsSendMessage(to, message, file = null) {
            if (!this.socket) return;

            const apiStore = useApiStore();
            const userStore = useUserStore();
            const privateDiscussionsStore = usePrivateDiscussionsStore();

            const publicKeyString = await apiStore.getUserPublicKey(to);
            const senderPublicKey = userStore.user.publicKey;

            const { forRecipient: encryptedMessageBase64, forSender: encryptedMessageBySenderBase64 } =
                await encryptMessageForBoth(message, publicKeyString, senderPublicKey);

            const fileId = file
                ? await uploadEncryptedFile(apiStore, file, publicKeyString, senderPublicKey)
                : null;

            try {
                this.socket.emit("sendMessage", {
                    to,
                    encryptedMessage: encryptedMessageBase64,
                    encryptedMessageBySender: encryptedMessageBySenderBase64,
                    file: fileId
                });
            } catch (err) {
                console.error("Error sending message:", err);
            }

            const messageData = new MessageManager();
            messageData.createMessage(
                userStore.user.uniqueId,
                to,
                encryptedMessageBase64,
                encryptedMessageBySenderBase64,
                publicKeyString,
                senderPublicKey
            );

            if (fileId) messageData.addFileToMessage(fileId);
            await privateDiscussionsStore.addMessageToDiscussion(messageData.getMessage());
        }
    }
})