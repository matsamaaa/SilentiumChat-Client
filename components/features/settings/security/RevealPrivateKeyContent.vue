<template>
    <div>
        <h3 class="text-xl font-semibold text-gray-100 border-b border-gray-700 pb-2">Reveal Private Key</h3>
        <p class="text-gray-500 text-sm  py-2">This key is used to decrypt your messages. Keep it safe!</p>
        
        <div v-if="isValidPassword" class="p-4 mb-2 bg-gray-900 border border-green-600 rounded-lg shadow-md">
            <p class="text-sm font-medium text-green-400 mb-2">Your private key is successfully revealed:</p>


            <div class="flex items-start justify-between">
                <span class="text-sm font-mono text-gray-300 select-all break-all mr-4 flex-grow">
                    {{ privateKey }}
                </span>

                <CopyButton :isCopied="isCopied" color="green" @execute="copyKey" />
            </div>

            <div class="mt-4 flex flex-wrap gap-2">
                <NormalButton
                    label="Export Private Key (.pem)"
                    icon="fa-download"
                    color="green"
                    @execute="exportPrivateKey"
                />

                <NormalButton
                    v-if="publicKey"
                    label="Export Public Key (.pem)"
                    icon="fa-download"
                    color="indigo"
                    @execute="exportPublicKey"
                />
            </div>
        </div>

        <NormalButton 
            label="Reveal Private Key" 
            icon="fa-key" 
            @execute="requestPassword" 
            />

        <PasswordValidation 
            v-if="hasRequest && !isValidPassword" 
            @close="hasRequest = false" 
            @submit="revealPrivateKey"
        />
    </div>
</template>

<script setup>
import CopyButton from '~/components/ui/buttons/CopyButton.vue';
import NormalButton from '~/components/ui/buttons/NormalButton.vue';
import PasswordValidation from '~/components/ui/popups/PasswordValidationPopup.vue';

import { useUserStore } from '#imports';

const userStore = useUserStore();

const isValidPassword = ref(false);
const isCopied = ref(false);
const privateKey = ref('');
const hasRequest = ref(false);

const publicKey = computed(() => userStore.user?.publicKey || '');

const base64ToPem = (base64, label) => {
    const clean = (base64 || '').replace(/\s+/g, '');
    const lines = clean.match(/.{1,64}/g);
    const body = lines ? lines.join('\n') : clean;
    return `-----BEGIN ${label}-----\n${body}\n-----END ${label}-----\n`;
};

const downloadTextFile = (filename, content, mimeType = 'application/x-pem-file;charset=utf-8') => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
};

const requestPassword = () => {
    hasRequest.value = true;
};

const revealPrivateKey = async () => {
    privateKey.value = await userStore.getPrivateKey() || '';
    isValidPassword.value = true;
    hasRequest.value = false;
};

const exportPrivateKey = () => {
    if (!privateKey.value) return;
    const filename = `silentium_private_key_${userStore.user?.uniqueId || 'user'}.pem`;
    const pem = base64ToPem(privateKey.value, 'PRIVATE KEY');
    downloadTextFile(filename, pem);
};

const exportPublicKey = () => {
    if (!publicKey.value) return;
    const filename = `silentium_public_key_${userStore.user?.uniqueId || 'user'}.pem`;
    const pem = base64ToPem(publicKey.value, 'PUBLIC KEY');
    downloadTextFile(filename, pem);
};

const copyKey = async () => {
    try {
        await navigator.clipboard.writeText(privateKey.value);
        isCopied.value = true;
        setTimeout(() => {
            isCopied.value = false;
        }, 3000);

    } catch (err) {
        console.error('Failed to copy key:', err);
    }
};
</script>