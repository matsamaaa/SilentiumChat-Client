import { bufferToBase64, base64ToBuffer } from "../conversion";

export const generateAESKey = async (bits = 256) => {
    const key = await window.crypto.subtle.generateKey(
        { name: "AES-GCM", length: bits },
        true,
        ["encrypt", "decrypt"]
    );
    return key;
}

export const generateIVKey = () => {
    return window.crypto.getRandomValues(new Uint8Array(12));
}

export const encryptDataWithAES = async (dataText, aesKey, iv) => {
    const encoder = new TextEncoder();
    const encryptedData = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        aesKey,
        encoder.encode(dataText)
    );
    return bufferToBase64(encryptedData);
}

export const decryptDataWithAES = async (encryptedDataBase64, aesKey, ivBase64) => {
    const encryptedDataBuffer = base64ToBuffer(encryptedDataBase64);
    const ivBuffer = base64ToBuffer(ivBase64);

    const decryptedData = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: ivBuffer },
        aesKey,
        encryptedDataBuffer
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
}

export const encryptAesKeyWithRSA = async (aesKey, publicKeyBase64) => {
    const rawAesKey = await crypto.subtle.exportKey("raw", aesKey);
    const publicKeyBuffer = base64ToBuffer(publicKeyBase64);
    const publicKey = await crypto.subtle.importKey(
        "spki",
        publicKeyBuffer,
        { name: "RSA-OAEP", hash: "SHA-256" },
        false,
        ["encrypt"]
    );

    const encryptedAesKey = await crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        publicKey,
        rawAesKey
    );

    return bufferToBase64(encryptedAesKey);
}

export const decryptAesKeyWithRSA = async (encryptedAesKeyBase64) => {
    try {
        const userStore = useUserStore();
        const privateKeyString = await userStore.getPrivateKey();
        if (!privateKeyString) {
            throw new Error("Private key not found");
        }

        const privateKeyBuffer = base64ToBuffer(privateKeyString);
        const privateKey = await crypto.subtle.importKey(
            "pkcs8",
            privateKeyBuffer,
            { name: "RSA-OAEP", hash: "SHA-256" },
            false,
            ["decrypt"]
        );

        const encryptedAesKeyBuffer = base64ToBuffer(encryptedAesKeyBase64);
        const rawAesKey = await crypto.subtle.decrypt(
            { name: "RSA-OAEP" },
            privateKey,
            encryptedAesKeyBuffer
        );

        const aesKey = await crypto.subtle.importKey(
            "raw",
            rawAesKey,
            { name: "AES-GCM" },
            false,
            ["encrypt", "decrypt"]
        );

        return aesKey;
    } catch (err) {
        console.error("Error decrypting AES key:", err);
    }
};