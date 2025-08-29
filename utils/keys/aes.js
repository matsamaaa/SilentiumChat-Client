import { bufferToBase64, base64ToBuffer } from "../conversion";

const generateAESKey = async (bits = 256) => {
    const key = await window.crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: bits
        },
        true, // key is exportable
        ["encrypt", "decrypt"]
    );

    return key;
}

const generateIVKey = () => {
    return window.crypto.getRandomValues(new Uint8Array(12));
}

const encryptAesKeyWithRSA = async (aesKey, publicKeyBase64) => {
    // aes key to array
    const rawAesKey = await crypto.subtle.exportKey("raw", aesKey);

    // Recipient public key
    const publicKeyBuffer = base64ToBuffer(publicKeyBase64);
    const publicKey = await crypto.subtle.importKey(
        "spki",
        publicKeyBuffer,
        {
            name: "RSA-OAEP",
            hash: "SHA-256"
        },
        false,
        ["encrypt"]
    );

    // Encrypt the aes key
    const encryptedAesKey = await crypto.subtle.encrypt(
        {
            name: "RSA-OAEP"
        },
        publicKey,
        rawAesKey
    );

    return bufferToBase64(encryptedAesKey);
}

const decryptAesKeyWithRSA = async (encryptedAesKeyBase64) => {
    try {
        const userStore = useUserStore();
        const privateKeyString = userStore.privateKey;
        if (!privateKeyString) {
            throw new Error("Private key not found");
        }

        // convert privateKeyString to ArrayBuffer
        const privateKeyBuffer = base64ToBuffer(privateKeyString);
        const privateKey = await crypto.subtle.importKey(
            "pkcs8",
            privateKeyBuffer,
            {
                name: "RSA-OAEP",
                hash: "SHA-256"
            },
            false,
            ["decrypt"]
        );

        // convert encryptedAesKeyBase64 to ArrayBuffer
        const encryptedAesKeyBuffer = base64ToBuffer(encryptedAesKeyBase64);
        
        // decrypt AES key
        const rawAesKey = await crypto.subtle.decrypt(
            {
                name: "RSA-OAEP"
            },
            privateKey,
            encryptedAesKeyBuffer
        );

        // get valid AES key
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

export { generateAESKey, generateIVKey, decryptAesKeyWithRSA, encryptAesKeyWithRSA };