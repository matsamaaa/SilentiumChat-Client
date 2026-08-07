import { generateAESKey, generateIVKey, encryptAesKeyWithRSA, encryptFile } from '~/utils/keys/aes.js';
import { getFileExtension } from '~/utils/conversion.js';
import FileManager from '~/utils/managers/fileManager.js'; // adapte le chemin

export const uploadEncryptedFile = async (apiStore, file, recipientPublicKey, senderPublicKey) => {
    const aesKey = await generateAESKey();
    const iv = generateIVKey();

    const [encryptedAesKey, encryptedKeySender] = await Promise.all([
        encryptAesKeyWithRSA(aesKey, recipientPublicKey),
        encryptAesKeyWithRSA(aesKey, senderPublicKey)
    ]);

    const { encryptedData, authTag } = await encryptFile(file, aesKey, iv);

    const fileData = new FileManager().createFile(
        iv,
        authTag,
        getFileExtension(file),
        encryptedData,
        encryptedAesKey,
        encryptedKeySender
    );

    const response = await apiStore.postFile(fileData);
    return response.fileId;
};