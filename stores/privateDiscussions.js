import { decryptMessage } from "~/utils/messages";

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
            try {
                const { from, to } = message;
                const userStore = useUserStore();

                // check what message we decrypt
                let newMessage;
                if (from === userStore.user.uniqueId) { // own message
                    // decrypt message
                    const decryptedBySender = await decryptMessage(message.encryptedMessageBySender);

                    // decrypt files
                    const files = [];
                    for (const file of message.files) {
                        const url = await getDecryptedFileUrl(file, true);
                        files.push({ url: url.url, name: url.name, extension: url.extension });
                    }

                    newMessage = { ...message, encryptedMessageBySender: decryptedBySender, files: files };
                } else { // received message
                    const decryptedByReceiver = await decryptMessage(message.encryptedMessage);

                    // decrypt files
                    const files = [];
                    for (const file of message.files) {
                        const url = await getDecryptedFileUrl(file);
                        files.push({ url: url.url, name: url.name, extension: url.extension });
                    }

                    newMessage = { ...message, encryptedMessage: decryptedByReceiver, files: files };
                }

                // check discussion and add message
                let discussion = this.getDiscussion(from, to);
                if (!discussion) discussion = this.addDiscussion(from, to);

                // add message
                discussion.encryptedMessages.push(newMessage);

                // update message order with timestamp
                discussion.encryptedMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                return newMessage;
            } catch (err) {
                console.error("Error adding message to discussion:", err);
            }
        }
    }
});
