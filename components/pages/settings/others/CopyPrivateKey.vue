<template>
    <div class="space-y-6">
        <h3 class="text-xl font-semibold text-gray-100 border-b border-gray-700 pb-2">Private Key</h3>
        
        <p class="text-gray-500 text-sm">This key is used to decrypt your messages. Keep it safe!</p>

        <div v-if="isValidPassword" class="p-4 bg-gray-900 border border-green-600 rounded-lg shadow-md">
            <p class="text-sm font-medium text-green-400 mb-2">Your private key is successfully revealed:</p>
            
            <div class="flex items-start justify-between">
                <span class="text-sm font-mono text-gray-300 select-all break-all mr-4 flex-grow">
                    {{ privateKey }}
                </span>

                <button 
                    @click="copyKey" 
                    :class="[
                        'flex items-center px-3 py-1 text-xs font-medium rounded-lg transition duration-150 flex-shrink-0 mt-1',
                        isCopied ? 'bg-green-700 text-white' : 'bg-green-600 text-white hover:bg-green-700'
                    ]"
                >
                    <FontAwesomeIcon :icon="isCopied ? 'fa-check' : 'fa-copy'" class="mr-2" />
                    {{ isCopied ? 'Copied!' : 'Copy Key' }}
                </button>
            </div>
        </div>

        <button 
            v-else
            @click="hasRequest = true"
            type="submit"
            class="px-5 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 transition duration-150"
        >
            <FontAwesomeIcon icon="fa-lock" class="mr-2" />
            Reveal Private Key
        </button>
    </div>

    <PasswordValidation 
        v-if="hasRequest && !isValidPassword" 
        @submit="revealPrivateKey" 
        @close="hasRequest = false"
    />
</template>

<script setup>
import { ref } from 'vue';
import PasswordValidation from '@/components/popups/PasswordValidation.vue';
import { useUserStore } from '#imports';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const userStore = useUserStore();
const hasRequest = ref(false);
const isValidPassword = ref(false);
const isCopied = ref(false);

const privateKey = ref('');

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