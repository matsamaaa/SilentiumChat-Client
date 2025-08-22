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
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

const Base64ToBuffer = (base64) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

const getPrivateKeyFromDB = async () => {
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
            const getRequest = store.get("privateKey");

            getRequest.onsuccess = () => resolve(getRequest.result);
            getRequest.onerror = () => reject(getRequest.error);
        };

        request.onerror = () => reject(request.error);
    });
}

const setPrivateKeyInDB = async (privateKey) => {
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
            const putRequest = store.put(privateKey, "privateKey");

            putRequest.onsuccess = () => resolve();
            putRequest.onerror = () => reject(putRequest.error);
        };

        request.onerror = () => reject(request.error);
    });
}

export { generateKeyPair, bufferToBase64, Base64ToBuffer, getPrivateKeyFromDB, setPrivateKeyInDB };
