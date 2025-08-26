const generateKeyPair = async () => {
    const keyPair = await window.crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256"
        },
        true, // key is exportable
        ["encrypt", "decrypt"]
    );

    // export keys to PEM format
    const publicKey = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
    const privateKey = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

    return { publicKey, privateKey };
}

const bufferToBase64 = (buffer) => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    const chunkSize = 0x8000; // 32k chunks
    for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.subarray(i, i + chunkSize);
        binary += String.fromCharCode(...chunk);
    }
    return btoa(binary);
};

const base64ToBuffer = (base64) => {
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
};

const getPrivateKeyFromDB = async (userId) => {
    if (typeof window === 'undefined') return null;

    return new Promise((resolve, reject) => {
        const request = indexedDB.open("SilentiumDB", 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains("keys")) {
                db.createObjectStore("keys");
            }
        };

        request.onsuccess = () => {
            const db = request.result;
            const tx = db.transaction("keys", "readonly");
            const store = tx.objectStore("keys");
            const getRequest = store.get(`privateKey_${userId}`);

            getRequest.onsuccess = () => resolve(getRequest.result);
            getRequest.onerror = () => reject(getRequest.error);
        };

        request.onerror = () => reject(request.error);
    });
}

const setPrivateKeyInDB = async (privateKey, userId) => {
    if (typeof window === 'undefined') return null;
    
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("SilentiumDB", 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains("keys")) {
                db.createObjectStore("keys");
            }
        };

        request.onsuccess = () => {
            const db = request.result;
            const tx = db.transaction("keys", "readwrite");
            const store = tx.objectStore("keys");
            const putRequest = store.put(privateKey, `privateKey_${userId}`);

            putRequest.onsuccess = () => resolve();
            putRequest.onerror = () => reject(putRequest.error);
        };

        request.onerror = () => reject(request.error);
    });
}

const isSameKey = (key1, key2) => {
    if (!key1 || !key2) return false;
    return key1 === key2;
}

const stringToUint8Array = (str) => {
    return new Uint8Array(str.split(',').map(Number));
}

export { generateKeyPair, bufferToBase64, base64ToBuffer, getPrivateKeyFromDB, setPrivateKeyInDB, isSameKey, stringToUint8Array };