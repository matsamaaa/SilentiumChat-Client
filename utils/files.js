import { useApiStore } from "~/stores/api";
import { decryptAesKeyWithRSA } from "./keys/aes";

const encryptFile = async (file, aesKey, iv) => {
    try {
        const fileArrayBuffer = await file.arrayBuffer();
        const encryptedBuffer = await window.crypto.subtle.encrypt(
            { name: "AES-GCM", iv, tagLength: 128 },
            aesKey,
            fileArrayBuffer
        );

        const encryptedUint8 = new Uint8Array(encryptedBuffer);
        const authTag = encryptedUint8.slice(encryptedUint8.length - 16);
        const encryptedData = encryptedUint8.slice(0, encryptedUint8.length - 16);

        return { encryptedData, authTag };
    } catch (err) {
        console.error("Error encrypting file:", err);
        throw err;
    }
};


const decryptFile = async ({ encryptedData, authTag }, aesKey, iv) => {
    try {
        const fullBuffer = new Uint8Array(encryptedData.length + authTag.length);
        fullBuffer.set(encryptedData, 0);
        fullBuffer.set(authTag, encryptedData.length);

        const decryptedArrayBuffer = await window.crypto.subtle.decrypt(
            { name: "AES-GCM", iv, tagLength: 128 },
            aesKey,
            fullBuffer
        );
        return new Uint8Array(decryptedArrayBuffer);
    } catch (err) {
        console.error("Error decrypting file:", err);
        throw err;
    }
};

const getDecryptedFileUrl = async (file, own = false) => {
    const apiStore = useApiStore();

    try {
        // recovery file and metadata
        const cryptedFile = await apiStore.getFile(file);
        const fileMetadata = await apiStore.getFileMetadata(file);

        // decrypt AES key with RSA
        const decryptAesKey = await decryptAesKeyWithRSA(own ? fileMetadata.encryptedKeySender : fileMetadata.encryptedKey);

        // decrypt file
        const decryptedFile = await decryptFile(
            { 
                encryptedData: cryptedFile, 
                authTag: stringToUint8Array(fileMetadata.authTag) 
            }, 
            decryptAesKey, 
            stringToUint8Array(fileMetadata.iv)
        );

        // create Blob and URL
        const blob = new Blob([decryptedFile], { type: fileMetadata.contentType || 'application/octet-stream' });
        const url = URL.createObjectURL(blob);

        return { url, name: fileMetadata.name, extension: fileMetadata.extension };
    } catch (err) {
        console.error("Error getting decrypted file URL:", err);
        throw err;
    }
}

export { encryptFile, decryptFile, getDecryptedFileUrl };