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
            console.log(message)
            try {
                const { from, to } = message;
                const userStore = useUserStore();
                console.log('test1')
                // check what message we decrypt
                let newMessage;
                if (from === userStore.user.uniqueId) { // own message
                    // decrypt message
                    const decryptedBySender = await decryptMessage(message.encryptedMessageBySender);
                    console.log('test3')
                    // decrypt files
                    const files = [];
                    for (const file of message.files) {
                        const url = await getDecryptedFileUrl(file, true);
                        files.push({ url: url.url, name: url.name });
                    }
                    console.log('test4')
                    newMessage = { ...message, encryptedMessageBySender: decryptedBySender, files: files };
                } else { // received message
                    const decryptedByReceiver = await decryptMessage(message.encryptedMessage);

                    // decrypt files
                    const files = [];
                    for (const file of message.files) {
                        const url = await getDecryptedFileUrl(file);
                        files.push({ url: url.url, name: url.name });
                    }

                    newMessage = { ...message, encryptedMessage: decryptedByReceiver, files: files };
                }
                console.log('test2')
                // check discussion and add message
                let discussion = this.getDiscussion(from, to);
                if (!discussion) discussion = this.addDiscussion(from, to);

                discussion.encryptedMessages.push(newMessage);
                return newMessage;
            } catch (err) {
                console.error("Error adding message to discussion:", err);
            }
        }
    }
});
