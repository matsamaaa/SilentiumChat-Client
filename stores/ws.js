import { defineStore } from 'pinia'
import { useApiStore } from './api'
import { io } from 'socket.io-client';
import { encryptMessage } from '~/utils/messages';
import { usePrivateDiscussionsStore } from './privateDiscussions';
import { encryptFile } from '~/utils/files';
import MessageManager from '~/utils/managers/messageManager';
import FileManager from '~/utils/managers/fileManager';
import { encryptAesKeyWithRSA, generateAESKey, generateIVKey } from '~/utils/keys/aes';

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
            const apiStore = useApiStore();
            const userStore = useUserStore();
            const privateDiscussionsStore = usePrivateDiscussionsStore();

            // recipient message
            const publicKeyString = await apiStore.getUserPublicKey(to);
            const encryptedMessageBase64 = await encryptMessage(message, publicKeyString);

            // sender message
            const encryptedMessageBySenderBase64 = await encryptMessage(message, userStore.user.publicKey);
            let fileId = null;

            if (file) {
                // keys
                const aesKey = await generateAESKey();
                const iv = generateIVKey();

                // aesKey encrypt with RSAkey
                const encryptedAesKey = await encryptAesKeyWithRSA(aesKey, publicKeyString);
                const encryptedKeySender = await encryptAesKeyWithRSA(aesKey, userStore.user.publicKey);

                // encrypt file with AES
                const { encryptedData, authTag } = await encryptFile(file, aesKey, iv);

                // upload file
                const fileData = new FileManager().createFile(
                    iv,
                    authTag,
                    new Blob([encryptedData], { type: "application/octet-stream" }),
                    encryptedAesKey,
                    encryptedKeySender
                );

                const response = await apiStore.postFile(
                    to,
                    fileData
                );

                fileId = response.fileId;
            }
            
            try {
                this.socket.emit("sendMessage", { to, encryptedMessage: encryptedMessageBase64, encryptedMessageBySender: encryptedMessageBySenderBase64, file: fileId });
            } catch (err) {
                console.error("Error sending message:", err);
            }

            // add message to local store
            const messageData = new MessageManager();
            messageData.createMessage(
                userStore.user.uniqueId,
                to,
                encryptedMessageBase64,
                encryptedMessageBySenderBase64,
                publicKeyString,
                userStore.user.publicKey
            );
            console.log(file, fileId)
            if (file) messageData.addFileToMessage(fileId);
            console.log(messageData);
            await privateDiscussionsStore.addMessageToDiscussion(messageData.getMessage());
        }
    }
})