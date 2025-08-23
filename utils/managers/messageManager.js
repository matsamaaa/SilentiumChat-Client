class MessageManager {
    constructor() {
        this.message = {
            from: null,
            to: null,
            encryptedMessage: null,
            encryptedMessageBySender: null,
            timestamp: Date.now(),

            isRead: false,
            isDeleted: false,
            isPinned: false,
            publicKeyUsed: null,
            publicKeySenderUsed: null
        };
    }

    createMessage(from, to, encryptedMessage, encryptedMessageBySender, publicKeyUsed, publicKeySenderUsed) {
        this.message.from = from;
        this.message.to = to;
        this.message.encryptedMessage = encryptedMessage;
        this.message.encryptedMessageBySender = encryptedMessageBySender;
        this.message.publicKeyUsed = publicKeyUsed;
        this.message.publicKeySenderUsed = publicKeySenderUsed;
        return this.message;
    }
}

export default MessageManager;