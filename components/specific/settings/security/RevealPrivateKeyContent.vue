<template>
    <div>
        <h3 class="text-xl font-semibold text-gray-100 border-b border-gray-700 pb-2">Reveal Private Key</h3>
        <p class="text-gray-500 text-sm">This key is used to decrypt your messages. Keep it safe!</p>
        
        <div v-if="isValidPassword" class="p-4 bg-gray-900 border border-green-600 rounded-lg shadow-md">
            <p class="text-sm font-medium text-green-400 mb-2">Your private key is successfully revealed:</p>


        </div>

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

        <NormalButton label="Reveal Private Key" icon="fa-key" @execute="handleRevealKey" />
    </div>
</template>

<script setup>
import NormalButton from '~/components/buttons/NormalButton.vue';

const isValidPassword = ref(false);
</script>