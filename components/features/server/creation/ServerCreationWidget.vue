<template>
    <div class="flex flex-col items-center w-full h-full">
        <UploadBannerContent @update:banner="(newBanner) => banner = newBanner" />
        <div class="flex flex-col items-center justify-center flex-1 w-full">
            <div class="flex flex-row items-center gap-3">
                <UploadIconContent @update:icon="(newIcon) => icon = newIcon" />
                <NormalInput v-model="name" placeholder="Server Name" class="w-64" />
            </div>
            <br />  
            <NormalButton label="Create Server" icon="fa-server" @click="createServer">Create</NormalButton>
        </div>
    </div>
</template>

<script setup>
import NormalInput from '~/components/ui/inputs/NormalInput.vue';
import UploadIconContent from './UploadIconContent.vue';
import UploadBannerContent from './UploadBannerContent.vue';
import NormalButton from '~/components/ui/buttons/NormalButton.vue';
import { bufferToBase64 } from '~/utils/conversion.js';

import { generateRSAKeyPair } from '~/utils/keys/rsa.js';
import { generateAESKey, generateIVKey, encryptDataWithAES, encryptAesKeyWithRSA } from '~/utils/keys/aes';
import { encryptMessage } from '~/utils/messages.js';
import { useApiStore, useUserStore, useNavigationStore, useServersStore } from '#imports';

const icon = ref(null);
const name = ref('');
const banner = ref(null);
const navigationStore = useNavigationStore();
const serverStore = useServersStore();

const createServer = async () => {
    const apiStore = useApiStore();
    const userStore = useUserStore();

    try {
        const userPublicKey = userStore.user?.publicKey || '';

        // generate RSA key pair for the server
        const { publicKey, privateKey } = await generateRSAKeyPair();
        const publicKeyBase64 = bufferToBase64(publicKey);
        const privateKeyBase64 = bufferToBase64(privateKey);

        // generate AES key and IV for encrypting the server's private key
        const aesKey = await generateAESKey();
        const iv = generateIVKey();

        // encrypt the server's private key with AES
        const encryptedPrivateKey = await encryptDataWithAES(privateKeyBase64, aesKey, iv);

        // encrypt the AES key with the user's public key
        const encryptedAesKey = await encryptAesKeyWithRSA(aesKey, userPublicKey);

        // payload to send to the server
        const encryptedPayload = {
            encryptedData: encryptedPrivateKey,
            encryptedAesKey: encryptedAesKey,
            iv: bufferToBase64(iv)
        };

        const server = await apiStore.createServer(
            name.value, 
            userStore.user.uniqueId, 
            publicKeyBase64, 
            encryptedPayload
        );

        serverStore.updateServerPrivateKey(server.code, privateKeyBase64);
        
        if (banner.value) {
            await apiStore.uploadServerBanner(server.code, banner.value.file);
        }
        if (icon.value) {
            await apiStore.uploadServerIcon(server.code, icon.value.file);
        }

        navigationStore.goToServer(server.code);
    } catch (error) {
        console.error('Error creating server:', error);
    }
}
</script>