import { bufferToBase64, base64ToBuffer } from "./conversion"

const encryptMessage = async (messageText, publicKeyString) => {
    // Recipient public key
    const publicKeyBuffer = base64ToBuffer(publicKeyString);
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

    // Encrypt the message
    const encoder = new TextEncoder();
    const encryptedMessage = await crypto.subtle.encrypt(
        {
            name: "RSA-OAEP"
        },
        publicKey,
        encoder.encode(messageText)
    );

    const encryptedMessageBase64 = bufferToBase64(encryptedMessage);
    return encryptedMessageBase64;
}

const decryptMessage = async (message) => {
    const userStore = useUserStore();
    const privateKeyString = await userStore.getPrivateKey();
    if(!privateKeyString) {
        throw new Error("Error with private key");
    }

    // convert private key base64 to buffer
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

    // convert message base64 to buffer
    const messageBuffer = base64ToBuffer(message);
    const decryptedMessage = await crypto.subtle.decrypt(
        {
            name: "RSA-OAEP"
        },
        privateKey,
        messageBuffer
    );

    // convert message buffer to base64
    const decoder = new TextDecoder();
    return decoder.decode(decryptedMessage);
}

export { encryptMessage, decryptMessage };