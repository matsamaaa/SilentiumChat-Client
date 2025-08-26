class MessageManager {
    constructor() {
        this.message = {
            from: null,
            to: null,
            encryptedMessage: null,
            encryptedMessageBySender: null,
            timestamp: Date.now(),

            files: [],

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

    addFileToMessage(message) {
        this.message.files.push(message);
    }

    getMessage() {
        return this.message;
    }
}

export default MessageManager;