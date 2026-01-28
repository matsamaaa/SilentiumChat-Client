import { decryptMessage } from "~/utils/messages";

export const usePrivateDiscussionsStore = defineStore("privateDiscussions", {
    state: () => ({
        discussions: []
    }),
    actions: {
        async initialize() {
            const apiStore = useApiStore();
            
            const discussions = await apiStore.getLastMessages();
            discussions.reverse().map(async discussion => {
                const sender = discussion.users[0];
                const receiver = discussion.users[1];
                const username = discussion.username;

                // clean discussions
                this.removeDiscussion(receiver, sender);
                this.addDiscussion(sender, receiver, username);

                // add messages
                this.addMessageToDiscussion(discussion.encryptedMessages[0])
            });
        },
        async loadMessagesPage(to, page) {
            const apiStore = useApiStore();
            const messages = await apiStore.getPrivateDiscussion(to, page);

            messages.encryptedMessages.map(async message => {
                await this.addMessageToDiscussion(message, true);
            });
        },
        getDiscussion(from, to) {
            const discussion = this.discussions.find(d =>
                d.users.includes(from) && d.users.includes(to)
            );
            return discussion ? discussion : null;
        },

        addDiscussion(from, to, username = null) {
            const newDiscussion = {
                users: [from, to],
                encryptedMessages: [],
                isWaitingForResponse: null,
                username: username
            };
            this.discussions.push(newDiscussion);
            return newDiscussion;
        },

        async updateStatusDiscussion(to, from, status) {
            const apiStore = useApiStore();
            try {
                const discussion = this.getDiscussion(from, to);
                if (discussion) {
                    if (status) {
                        discussion.isWaitingForResponse = status === 'accepted' ? true : false;
                    } else {
                        const onlineDiscussion = await apiStore.getPrivateDiscussion(to);
                        discussion.isWaitingForResponse = onlineDiscussion.isWaitingForResponse;
                    }
                }

                return discussion;
            } catch (err) {
                console.error("Error updating discussion status:", err);
            }
        },

        removeDiscussion(from, to) {
            this.discussions = this.discussions.filter(
                d => !d.users.includes(from) || !d.users.includes(to)
            );
        },

        isAlreadyExistMessage(messageId, from, to) {
            const discussion = this.getDiscussion(from, to);
            if (!discussion) return false;

            return discussion.encryptedMessages.some(msg => msg._id === messageId);
        },

        async addMessageToDiscussion(message, isFront = false) {
            try {
                const { from, to } = message;
                const userStore = useUserStore();

                if(this.isAlreadyExistMessage(message._id, from, to)) {
                    return null;
                }

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
                if (!discussion) {
                    discussion = this.addDiscussion(from, to);
                    await this.updateStatusDiscussion(from, to);
                    discussion = this.getDiscussion(from, to); // re-fetch discussion
                } else if (discussion.isWaitingForResponse != true) {
                    await this.updateStatusDiscussion(from, to);
                    discussion = this.getDiscussion(from, to); // re-fetch discussion
                }

                // add message
                if (isFront) {
                    discussion.encryptedMessages.unshift(newMessage);
                } else {
                    discussion.encryptedMessages.push(newMessage);
                }

                // update message order with timestamp
                discussion.encryptedMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                return newMessage;
            } catch (err) {
                console.error("Error adding message to discussion:", err);
            }
        },

        clearDiscussions() {
            this.discussions = [];
        }
    }
});
