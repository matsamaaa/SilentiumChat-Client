import { decryptMessage } from "~/utils/messages";
import { getDecryptedFileUrl } from "~/utils/files";

export const usePrivateDiscussionsStore = defineStore("privateDiscussions", {
    state: () => ({
        discussions: []
    }),
    actions: {
        async initialize() {
            const apiStore = useApiStore();
            const discussions = await apiStore.getLastMessages();

            for (const discussion of discussions.reverse()) {
                const sender = discussion.users[0];
                const receiver = discussion.users[1];
                const username = discussion.username;

                this.removeDiscussion(receiver, sender);
                this.addDiscussion(sender, receiver, username);

                await this.addMessageToDiscussion(discussion.encryptedMessages[0]);
            }
        },

        async loadMessagesPage(to, page) {
            const apiStore = useApiStore();
            const messages = await apiStore.getPrivateDiscussion(to, page);

            for (const message of messages.encryptedMessages) {
                await this.addMessageToDiscussion(message, true);
            }
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
                        discussion.isWaitingForResponse = status === 'accepted';
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
            if (messageId == null) return false;

            return discussion.encryptedMessages.some(msg => msg._id === messageId);
        },

        async ensureDiscussionReady(from, to) {
            let discussion = this.getDiscussion(from, to);

            if (!discussion) {
                discussion = this.addDiscussion(from, to);
                await this.updateStatusDiscussion(from, to);
                discussion = this.getDiscussion(from, to);
            } else if (discussion.isWaitingForResponse !== true) {
                await this.updateStatusDiscussion(from, to);
                discussion = this.getDiscussion(from, to); // refresh discussion after status update
            }

            return discussion;
        },

        async addMessageToDiscussion(message, isFront = false) {
            try {
                const { from, to } = message;
                const userStore = useUserStore();

                if (this.isAlreadyExistMessage(message._id, from, to)) {
                    return null;
                }

                const isItSender = from === userStore.user.uniqueId;
                const decryptedMessage = await decryptMessage(
                    isItSender ? message.encryptedMessageBySender : message.encryptedMessage
                );

                const files = await Promise.all(
                    (message.files || []).map(async (file) => {
                        const { url, name, extension } = await getDecryptedFileUrl(file, isItSender);
                        return { url, name, extension };
                    })
                );

                const newMessage = {
                    ...message,
                    [isItSender ? 'encryptedMessageBySender' : 'encryptedMessage']: decryptedMessage,
                    files
                };

                const discussion = await this.ensureDiscussionReady(from, to);

                if (isFront) {
                    discussion.encryptedMessages.unshift(newMessage);
                } else {
                    discussion.encryptedMessages.push(newMessage);
                }

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