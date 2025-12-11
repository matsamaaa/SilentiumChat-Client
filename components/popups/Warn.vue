<template>
    <div class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 h-screen !mt-0">
        <div class="bg-gray-800 rounded-lg shadow-2xl p-6 w-full max-w-sm space-y-3 transform transition-all duration-300 scale-100 opacity-100">
            
            <div class="flex items-center justify-between border-b border-gray-700 pb-3">
                <h3 class="text-xl font-bold text-gray-100">Warn</h3>
                
                <button @click="close" class="text-gray-500 hover:text-gray-400 transition duration-150 p-1 rounded-full">
                    <FontAwesomeIcon icon="fa-xmark" class="text-xl" />
                </button>
            </div>

            <div class="text-gray-300">
                <FontAwesomeIcon icon="fa-circle-exclamation" class="text-red-500 mr-2" />
                {{ message }}
            </div>

            <div class="flex justify-start space-x-4 mt-4">
                <button 
                    @click="close" 
                    class="px-4 py-2 bg-gray-700 text-white font-medium rounded-lg shadow-md hover:bg-gray-600 transition duration-150"
                >
                    Cancel
                </button>
                <button
                    @click="confirm"
                    class="px-4 py-2 bg-red-500 text-white font-medium rounded-lg shadow-md hover:bg-red-400 transition duration-150"
                >
                    Confirm
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const emit = defineEmits(['close', 'confirm']);

const props = defineProps({
    message: {
        type: String,
        required: true
    }
});

const confirm = () => {
    emit('confirm');
};

const close = () => {
    emit('close');
};
</script>