<template>
    <div>
        <h3 class="text-xl font-semibold text-gray-100 border-b border-gray-700 pb-2">Import Private Key</h3>
        <p class="text-gray-500 text-sm gap py-2">Import your private key here.</p>
        
        <form @submit.prevent="handleImport" class="space-y-2 w-full sm:w-96">

            <label for="private-key" class="block text-sm font-medium text-gray-300">Private Key</label>
            <NormalInput
                id="private-key"
                type="text"
                v-model="privateKey"
                placeholder="Enter your private key here"
                required=true
                />

            <NormalButton
                type="submit"
                label="Import Private Key"
                class="mt-2 w-full px-4 py-2 text-sm font-medium rounded-lg transition duration-150 sm:w-auto"
                :disabled="!privateKey"
                />

        </form>

        <Warn
            v-if="hasRequest && !hasConfirmed" 
            @close="hasRequest = false" 
            @confirm="handleConfirmation" 
            :message="`Importing a private key will overwrite your current key. Do you want to continue?`"
        />
    </div>
</template>

<script setup>
import NormalButton from '~/components/ui/buttons/NormalButton.vue';
import NormalInput from '~/components/ui/inputs/NormalInput.vue';

import { useUserStore } from '#imports';
import Warn from '~/components/popups/Warn.vue';

const userStore = useUserStore();

const privateKey = ref(null);
const hasRequest = ref(false);
const hasConfirmed = ref(false);

const handleImport = () => {
    if (privateKey.value) {
        hasRequest.value = true;
    }
};

const handleConfirmation = () => {
    hasConfirmed.value = true;
    hasRequest.value = false;
    
    userStore.updatePrivateKey(privateKey.value);
    privateKey.value = '';
};
</script>