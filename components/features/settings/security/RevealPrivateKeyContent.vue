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
        </div>

        <NormalButton label="Reveal Private Key" icon="fa-key" @execute="revealPrivateKey" />
    </div>
</template>

<script setup>
import CopyButton from '~/components/buttons/CopyButton.vue';
import NormalButton from '~/components/buttons/NormalButton.vue';

import { useUserStore } from '#imports';

const userStore = useUserStore();

const isValidPassword = ref(false);
const isCopied = ref(false);
const privateKey = ref('');
const hasRequest = ref(false);

const revealPrivateKey = async () => {
    privateKey.value = await userStore.getPrivateKey();
    isValidPassword.value = true;
    hasRequest.value = false;
};

const copyKey = async () => {
    if (!privateKey.value) return;

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