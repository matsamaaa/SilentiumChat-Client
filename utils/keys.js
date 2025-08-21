import crypto from "crypto";

const generateKeyPair = async () => {
    return new Promise((resolve, reject) => {
        crypto.generateKeyPair("rsa", {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: "spki",
                format: "pem"
            },
            privateKeyEncoding: {
                type: "pkcs8",
                format: "pem"
            }
        }, (err, publicKey, privateKey) => {
            if (err) return reject(err);
            resolve({ publicKey, privateKey });
        });
    });
}

export default generateKeyPair;
