<template>
    <div>
        <h3 class="text-xl font-semibold text-gray-100 border-b border-gray-700 pb-2">Import Key</h3>
        <p class="text-gray-500 text-sm gap py-2">Choose the key type, then import it.</p>

        <div class="mb-4">
            <ToggleTabs v-model="selectedKeyType" :options="keyTypeOptions" />
        </div>
        
        <form @submit.prevent="handleImport" class="space-y-2 w-full sm:w-96">

            <label for="key-input" class="block text-sm font-medium text-gray-300">{{ selectedKeyTypeLabel }}</label>
            <NormalInput
                id="key-input"
                type="text"
                v-model="keyValue"
                :placeholder="selectedKeyType === 'private' ? 'Enter your private key here' : 'Enter your public key here'"
                required
                />

            <div class="pt-2">
                <label class="block text-sm font-medium text-gray-300">Or upload a key file</label>
                <input
                    ref="fileInput"
                    type="file"
                    accept=".pem,.key,.txt"
                    class="sr-only"
                    @change="handleFileSelected"
                >

                <button
                    type="button"
                    class="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm flex items-center justify-center"
                    @click="triggerFilePicker"
                >
                    <FontAwesomeIcon icon="fa-file" class="mr-2" />
                    Choose a key file
                </button>

                <p v-if="selectedFileName" class="text-xs text-gray-300 mt-1 truncate">
                    Selected: {{ selectedFileName }}
                </p>

                <p class="text-xs text-gray-500 mt-1">Accepted: .pem (recommended), .key, .txt</p>
            </div>

            <NormalButton
                type="submit"
                :label="selectedKeyType === 'private' ? 'Import Private Key' : 'Import Public Key'"
                :disabled="!keyValue"
                icon="fa-key"
                />

        </form>

        <WarnPopup
            v-if="hasRequest && !hasConfirmed" 
            @close="hasRequest = false" 
            @confirm="handleConfirmation" 
            :message="confirmMessage"
        />
    </div>
</template>

<script setup>
import NormalButton from '~/components/ui/buttons/NormalButton.vue';
import NormalInput from '~/components/ui/inputs/NormalInput.vue';
import WarnPopup from '~/components/ui/popups/WarnPopup.vue';
import ToggleTabs from '~/components/ui/buttons/ToggleTabs.vue';

import { useApiStore, useUserStore } from '#imports';

const apiStore = useApiStore();
const userStore = useUserStore();

const selectedKeyType = ref('private');
const keyValue = ref(null);
const hasRequest = ref(false);
const hasConfirmed = ref(false);

const fileInput = ref(null);
const selectedFileName = ref('');

const keyTypeOptions = [
    { value: 'private', label: 'Private key' },
    { value: 'public', label: 'Public key' }
];

const selectedKeyTypeLabel = computed(() => {
    return selectedKeyType.value === 'private' ? 'Private Key' : 'Public Key';
});

const confirmMessage = computed(() => {
    if (selectedKeyType.value === 'private') {
        return 'Importing a private key will overwrite your current key. Do you want to continue?';
    }
    return 'Importing a public key will update the key stored on the server. Do you want to continue?';
});

const normalizeKeyInput = (input) => {
    const value = (input || '').trim();
    if (!value) return '';

    // Accept PEM input by stripping header/footer and whitespace.
    if (value.includes('-----BEGIN') && value.includes('-----END')) {
        return value
            .split(/\r?\n/)
            .filter(line => !line.startsWith('-----'))
            .join('')
            .replace(/\s+/g, '');
    }

    return value.replace(/\s+/g, '');
};

const handleFileSelected = async (event) => {
    const file = event?.target?.files?.[0];
    if (!file) return;
    selectedFileName.value = file.name;

    try {
        const text = await file.text();
        keyValue.value = normalizeKeyInput(text);
    } catch (err) {
        console.error('Failed to read key file:', err);
    } finally {
        // allow re-selecting the same file
        if (fileInput.value) fileInput.value.value = '';
    }
};

const triggerFilePicker = () => {
    if (!fileInput.value) return;
    fileInput.value.click();
};

const handleImport = () => {
    if (keyValue.value) {
        hasRequest.value = true;
    }
};

const handleConfirmation = async () => {
    hasConfirmed.value = true;
    hasRequest.value = false;

    const normalized = normalizeKeyInput(keyValue.value);
    if (!normalized) return;

    try {
        if (selectedKeyType.value === 'private') {
            await userStore.updatePrivateKey(normalized);
        } else {
            await apiStore.updatePublicKey(normalized);
            userStore.updateUserPublicKey(normalized);
        }
    } catch (err) {
        console.error('Failed to import key:', err);
    } finally {
        keyValue.value = '';
    }
};

watch(selectedKeyType, () => {
    hasRequest.value = false;
    hasConfirmed.value = false;
    keyValue.value = '';
    selectedFileName.value = '';
});
</script>