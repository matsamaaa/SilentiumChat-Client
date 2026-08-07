import { generateRSAKeyPair } from './rsa.js';
import { generateAESKey, generateIVKey, encryptDataWithAES, encryptAesKeyWithRSA } from './aes.js';
import { bufferToBase64 } from '~/utils/conversion.js';

/**
 * Génère une paire de clés RSA, chiffre la clé privée avec une clé AES
 * puis chiffre cette clé AES avec la clé publique du destinataire.
 */
export const generateEncryptedKeyPair = async (recipientPublicKey) => {
    const { publicKey, privateKey } = await generateRSAKeyPair();
    const publicKeyBase64 = bufferToBase64(publicKey);
    const privateKeyBase64 = bufferToBase64(privateKey);

    const aesKey = await generateAESKey();
    const iv = generateIVKey();
    const encryptedData = await encryptDataWithAES(privateKeyBase64, aesKey, iv);
    const encryptedAesKey = await encryptAesKeyWithRSA(aesKey, recipientPublicKey);

    return {
        publicKeyBase64,
        privateKeyBase64,
        encryptedPayload: { encryptedData, encryptedAesKey, iv: bufferToBase64(iv) }
    };
};