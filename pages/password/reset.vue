<template>
    <div class="flex items-center justify-center h-[93vh] w-full"> 
        
        <form @submit.prevent="handleSubmit" 
              class="bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl w-full max-w-sm 
                     flex flex-col items-center gap-6 border border-gray-700">

            <h1 class="text-3xl font-extrabold text-white mb-2">
                Reset Password
            </h1>
            
            <div v-if="loading" class="text-indigo-400 font-medium">
                Verifying reset credentials...
            </div>

            <div v-if="errorMessage" 
                 class="w-full p-3 bg-red-900/50 text-red-300 rounded-lg text-center font-medium border border-red-600">
                {{ errorMessage }}
            </div>

            <template v-if="!errorMessage">

                <input 
                    v-model="password" 
                    type="password" 
                    placeholder="New Password" 
                    required 
                    minlength="8"
                    class="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white 
                           focus:ring-blue-500 focus:border-blue-500 transition duration-150 placeholder-gray-400"
                />

                <input 
                    v-model="confirmPassword" 
                    type="password" 
                    placeholder="Confirm New Password" 
                    required 
                    minlength="8"
                    class="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white 
                           focus:ring-blue-500 focus:border-blue-500 transition duration-150 placeholder-gray-400"
                />

                <p v-if="!passwordsMatch && confirmPassword.split('').length > 0" class="text-sm text-red-400">
                    Passwords do not match.
                </p>

                <button 
                    type="submit"
                    :disabled="loading || !passwordsMatch || password.length < 8"
                    class="w-full py-3 px-4 rounded-lg font-semibold text-white transition duration-200 uppercase tracking-wider"
                >
                    <span v-if="!loading">Set New Password</span>
                    <span v-else>Processing...</span>
                </button>
            </template>
            
            <router-link to="/login" class="text-sm text-indigo-400 hover:text-indigo-300 transition duration-150 mt-2">
                &larr; Back to Login
            </router-link>

        </form>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { useApiStore } from '@/stores/api';
import { useNavigationStore } from '@/stores/navigation';
import { isSamePassword } from '#imports';

const route = useRoute();
const apiStore = useApiStore();
const navigationStore = useNavigationStore();

const token = ref(route.query.token || '');
const id = ref(route.query.id || '');

const password = ref('');
const confirmPassword = ref('');
const passwordsMatch = computed(() => isSamePassword(password.value, confirmPassword.value));

const loading = ref(false);
const errorMessage = ref(null);

const handleSubmit = async () => {
    if (!passwordsMatch.value) return;
    loading.value = true;
    errorMessage.value = null;
    const response = await apiStore.sendChangePasswordMail(id.value, token.value, password.value, confirmPassword.value);
    loading.value = false;

    if (response.success) navigationStore.goToLogin(); 
    else errorMessage.value = response.message || 'An error occurred while resetting the password.';
};
</script>