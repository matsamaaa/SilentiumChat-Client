<template>
    <div class="space-y-4">
        <h3 class="text-xl font-semibold text-gray-100 border-b border-gray-700 pb-2">Import Private Key</h3>
        
        <p class="text-sm text-gray-500">Paste your private key below to import and use it for message decryption.</p>

        <form @submit.prevent="handleImport" class="space-y-4">
            <input 
                type="text" 
                v-model="importedKey"
                placeholder="Enter your private key here..."
                required
                class="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            />
            
            <button 
                type="submit"
                :disabled="!importedKey"
                class="px-5 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Import Key
            </button>
        </form>
    </div>

    <Warn 
        v-if="hasRequest && !hasConfirmed" 
        @close="hasRequest = false" 
        @confirm="handleConfirmation" 
        :message="`Importing a private key will overwrite your current key. Do you want to continue?`" 
    />
</template>

<script setup>
import { ref } from 'vue';
import Warn from '@/components/popups/Warn.vue';
import { useUserStore } from '#imports';

const userStore = useUserStore();

const importedKey = ref('');
const hasRequest = ref(false);
const hasConfirmed = ref(false);

const handleImport = () => {
    if (importedKey.value) {
        hasRequest.value = true;
    }
};

const handleConfirmation = () => {
    hasConfirmed.value = true;
    hasRequest.value = false;
    
    userStore.updatePrivateKey(importedKey.value);
    importedKey.value = '';
};
</script>