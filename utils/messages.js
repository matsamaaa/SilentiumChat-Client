import { Base64ToBuffer } from "./keys"
import { useApiStore } from "../stores/api";

const encryptMessage = async (toUserId, messageText) => {
    const apiStore = useApiStore();

    // Recipient public key
    const publicKeyString = await apiStore.getUserPublicKey(toUserId);
    const publicKeyBuffer = Base64ToBuffer(publicKeyString);
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

export { encryptMessage };