<template>
    <div class="flex items-center justify-center h-[93vh] w-full"> 
        
        <form @submit.prevent="handleSubmit" 
              class="bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl w-full max-w-sm 
                     flex flex-col items-center gap-6 border border-gray-700">

            <h1 class="text-3xl font-extrabold text-white mb-2">
                Forgot Password
            </h1>
            
            <p v-if="!isRunning && !successMessage" class="text-sm text-gray-500 text-center">
                Enter your email below to receive a reset link.
            </p>

            <div v-if="successMessage && !isRunning" 
                 class="w-full p-3 bg-green-900/50 text-green-300 rounded-lg text-center font-medium border border-green-600">
                {{ successMessage }}
            </div>

            <input 
                v-model="email" 
                type="email" 
                placeholder="Your email address" 
                required 
                :disabled="isRunning || successMessage"
                class="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white 
                       focus:ring-indigo-600 focus:border-indigo-500 transition duration-150 placeholder-gray-400"
            />
            
            <button 
                type="submit"
                :disabled="isRunning || successMessage"
                class="w-full py-3 px-4 rounded-lg font-semibold text-white transition duration-200 uppercase tracking-wider
                       "
                :class="{'bg-indigo-600 hover:bg-indigo-500': !isRunning && !successMessage, 
                         'bg-gray-600 cursor-not-allowed': isRunning || successMessage}"
            >
                <span v-if="!isRunning && !successMessage">Send Reset Link</span>
                <span v-else-if="isRunning">Sending... Check your email</span>
                <span v-else>Done!</span>
            </button>
            
            <div v-if="isRunning" class="mt-2 w-full text-center p-3 bg-green-900/50 rounded-lg border border-green-700">
                <p class="text-sm text-gray-300 mb-1 font-medium">Please wait before trying again:</p>
                <p class="text-2xl font-bold font-mono text-green-400 animate-pulse">
                    {{ formatDateChrono(timer) }}
                </p>
            </div>
            <router-link to="/login" class="text-sm text-indigo-400 hover:text-indigo-300 transition duration-150 mt-2">
                &larr; Back to Login
            </router-link>

        </form>
    </div>
</template>

<script setup>
import { useApiStore } from '../stores/api';
import { formatDateChrono } from '~/utils/date';

const apiStore = useApiStore();
const email = ref('');
const successMessage = ref(null);

// chrono
const isRunning = ref(false);
const timer = ref(0);

let intervalId = null;
const COOLDOWN_DURATION = 600;

const handleSubmit = async () => {
    const result = await apiStore.sendResetPasswordMail(email.value);
    if (result && result.success) {
        successMessage.value = "Reset link sent successfully!";
        startTimer();
    }
}

const startTimer = () => {
    if (isRunning.value) return; 

    timer.value = COOLDOWN_DURATION;
    isRunning.value = true;

    intervalId = setInterval(() => {
        if (timer.value > 0) {
            timer.value--;
        } else {
            stopTimer();
        }
    }, 1000);
};

const stopTimer = () => {
    clearInterval(intervalId);
    isRunning.value = false;
    intervalId = null;
};
</script>