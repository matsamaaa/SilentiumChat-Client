<template>
    <div class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 h-screen !mt-0">
        <div class="bg-gray-800 rounded-lg shadow-2xl p-6 w-full max-w-sm space-y-3 transform transition-all duration-300 scale-100 opacity-100">
            
            <div class="flex items-center justify-between border-b border-gray-700 pb-3">
                <h3 class="text-xl font-bold text-gray-100">Password Validation</h3>
                
                <button @click="close" class="text-gray-400 hover:text-white transition duration-150 p-1 rounded-full hover:bg-gray-700">
                    <FontAwesomeIcon icon="fa-xmark" class="text-xl" />
                </button>
            </div>

            <form @submit.prevent="submitPassword" class="space-y-4">
                
                <div class="flex items-center gap-3">
                    <input 
                        type="password" 
                        v-model="password"
                        placeholder="Enter your password"
                        autocomplete="off"
                        required
                        class="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                    >
                
                    <button
                        type="submit"
                        :disabled="!password"
                        :class="{
                            'h-10 w-10 flex items-center justify-center text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-150 ease-in-out flex-shrink-0': true,
                            'opacity-50 cursor-not-allowed': !password,
                        }"
                        title="Send Password" 
                    >
                        <FontAwesomeIcon icon="paper-plane" class="text-lg" />
                    </button>
                </div>
                <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>
            </form>

        </div>
    </div>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useApiStore } from '#imports';

const apiStore = useApiStore();
const emit = defineEmits(['submit', 'close']);

const error = ref(null);
const password = ref('');

const submitPassword = async () => {
    error.value = null; 

    try {
        const response = await apiStore.isValidPassword(password.value);

        if (!response || response.valid === false) { 
            const message = response?.message || "Invalid password";
            
            error.value = message;
            return;
        }
        
        emit('submit', true);

    } catch (err) {
        const message = err.response?.data?.message || "An unexpected error occurred during password validation.";
        error.value = message;
    }
};

const close = () => {
    emit('close');
};
</script>