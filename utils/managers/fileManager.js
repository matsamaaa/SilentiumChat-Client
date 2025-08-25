class FileManager {
    constructor() {
        this.file = {
            iv: null,
            authTag: null,

            encryptedData: null,
            encryptedKey: null,
            encryptedKeySender: null
        };
    }

    createFile(iv, authTag, encryptedData, encryptedKey, encryptedKeySender, encryptedDataBySender) {
        this.file.iv = iv;
        this.file.authTag = authTag;

        // recipient
        this.file.encryptedData = encryptedData;
        this.file.encryptedKey = encryptedKey;

        // sender
        this.file.encryptedKeySender = encryptedKeySender;

        return this.file;
    }
}

export default FileManager;