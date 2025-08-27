class FileManager {
    constructor() {
        this.file = {
            iv: null,
            authTag: null,
            extension: null,

            encryptedData: null,
            encryptedKey: null,
            encryptedKeySender: null
        };
    }

    createFile(iv, authTag, extension, encryptedData, encryptedKey, encryptedKeySender, encryptedDataBySender) {
        this.file.iv = iv;
        this.file.authTag = authTag;
        this.file.extension = extension;

        // recipient
        this.file.encryptedData = encryptedData;
        this.file.encryptedKey = encryptedKey;

        // sender
        this.file.encryptedKeySender = encryptedKeySender;

        return this.file;
    }
}

export default FileManager;