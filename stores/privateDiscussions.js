import { decryptAesKeyWithRSA } from '~/utils/keys/aes';

export const usePrivateDiscussionsStore = defineStore("privateDiscussions", {
    state: () => ({
        discussions: []
    }),
    actions: {
        getDiscussion(from, to) {
            const discussion = this.discussions.find(d =>
                d.users.includes(from) && d.users.includes(to)
            );
            return discussion ? discussion : null;
        },

        addDiscussion(from, to) {
            const newDiscussion = {
                users: [from, to],
                encryptedMessages: []
            };
            this.discussions.push(newDiscussion);
            return newDiscussion;
        },

        removeDiscussion(from, to) {
            this.discussions = this.discussions.filter(
                d => !d.users.includes(from) || !d.users.includes(to)
            );
        },

        async addMessageToDiscussion(message) {
            const { from, to } = message;
            const userStore = useUserStore();
            const apiStore = useApiStore();

            // check what message we decrypt
            let newMessage;
            console.log('speed 1')
            if (from === userStore.user.uniqueId) {
                // decrypt message
                const decryptedBySender = await decryptMessage(message.encryptedMessageBySender);

                // decrypt files
                const files = [];

                for (const file of message.files) {
                    const cryptedFile = await apiStore.getFile(file);
                    const fileMetadata = await apiStore.getFileMetadata(file);
                    const decryptAesKey = await decryptAesKeyWithRSA(fileMetadata.encryptedKeySender);

                    const decryptedFile = await decryptFile(
                        { 
                            encryptedData: cryptedFile, 
                            authTag: stringToUint8Array(fileMetadata.authTag) 
                        }, 
                        decryptAesKey, 
                        stringToUint8Array(fileMetadata.iv)
                    );

                    const blob = new Blob([decryptedFile], { type: fileMetadata.contentType || 'application/octet-stream' });
                    const url = URL.createObjectURL(blob);

                    files.push({ url, name: fileMetadata.name });
                }
                
                newMessage = { ...message, encryptedMessageBySender: decryptedBySender, files: files };
            } else {
                const decryptedByReceiver = await decryptMessage(message.encryptedMessage);
                newMessage = { ...message, encryptedMessage: decryptedByReceiver };
            }
            console.log('speed 2')
            // check discussion and add message
            let discussion = this.getDiscussion(from, to);
            if (!discussion) discussion = this.addDiscussion(from, to);
            console.log('speed 3')
            discussion.encryptedMessages.push(newMessage);
            return newMessage;
        }
    }
});
