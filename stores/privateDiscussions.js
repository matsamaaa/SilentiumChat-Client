export const usePrivateDiscussionsStore = defineStore("privateDiscussions", {
    state: () => ({
        discussions: []
    }),
    actions: {
        getDiscussion(from, to) {
            const discussion = this.discussions.find(d =>
                d.users.includes(from) && d.users.includes(to)
            );
            console.log("Found discussion:", discussion);
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
            console.log("Adding message to discussion:", message);
            // check what message we decrypt
            let newMessage;
            if (from === userStore.user.uniqueId) {
                const decryptedBySender = await decryptMessage(message.encryptedMessageBySender);
                newMessage = { ...message, encryptedMessageBySender: decryptedBySender };
            } else {
                const decryptedByReceiver = await decryptMessage(message.encryptedMessage);
                newMessage = { ...message, encryptedMessage: decryptedByReceiver };
            }

            // check discussion and add message
            let discussion = this.getDiscussion(from, to);
            if (!discussion) discussion = this.addDiscussion(from, to);
            discussion.encryptedMessages.push(newMessage);

            console.log("Updated discussion:", discussion);
        }
    }
});
