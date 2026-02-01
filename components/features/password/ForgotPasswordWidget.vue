<template>
    <div class="flex items-center justify-center h-[93vh] w-full">

        <form 
            @submit.prevent="handleForgotPassword"
            class="bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl w-full max-w-sm flex flex-col items-stretch gap-6 border border-gray-700">

            <h1 class="text-3xl font-extrabold text-white mb-2 text-center">Forgot Password</h1>

            <NormalInput
                v-model="email"
                type="email"
                placeholder="Your email address"
                required
                :disabled="isRunning"
                />

            <p 
                v-if="isRunning"
                class="text-gray-500 text-sm gap py-2">
                Please wait {{ formatDateChrono(timer) }} before requesting another reset link.
            </p>

            <NormalButton
                type="submit"
                :disabled="isRunning"
                label="Send Reset Link"
                class="w-full"
                />

            <router-link to="/login" class="text-sm text-indigo-400 hover:text-indigo-300 transition duration-150 mt-2">
                &larr; Back to Login
            </router-link>

        </form>
    </div>
</template>

<script setup>
import NormalButton from '~/components/ui/buttons/NormalButton.vue';
import NormalInput from '~/components/ui/inputs/NormalInput.vue';

import { formatDateChrono } from '#imports';
import { useApiStore } from '#imports';

const apiStore = useApiStore();

const email = ref('');

let intervalId = null;
const isRunning = ref(false);
const timer = ref(0);
const COOLDOWN_DURATION = 600;

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

const handleForgotPassword = async () => {
    const result = await apiStore.sendResetPasswordMail(email.value);
    if (result && result.success) startTimer();
}
</script>