const encryptFile = async (file, aesKey, iv) => {
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
};


const decryptFile = async ({ encryptedData, authTag }, aesKey, iv) => {
    const fullBuffer = new Uint8Array(encryptedData.length + authTag.length);
    fullBuffer.set(encryptedData, 0);
    fullBuffer.set(authTag, encryptedData.length);

    const decryptedArrayBuffer = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv, tagLength: 128 },
        aesKey,
        fullBuffer
    );
    return new Uint8Array(decryptedArrayBuffer);
};

export { encryptFile, decryptFile };