<template>
    <div>
        <form @submit.prevent="handleSubmit" class="flex flex-col justify-center items-center gap-3 h-[93vh]">
            <h1 class="text-2xl font-bold">Forgot Password</h1>
            <input v-model="email" type="email" placeholder="Email" required />
            
            <p v-if="timer > 0">{{ formatDateChrono(timer) }}</p>

            <button type="submit">Send Mail</button>
        </form>
    </div>
</template>

<script setup>
import { useApiStore } from '../stores/api';
import { formatDateChrono } from '~/utils/date';

const apiStore = useApiStore();
const email = ref('');

// chrono
const isRunning = ref(false);
const timer = ref(0);

let intervalId = null;
const COOLDOWN_DURATION = 600;

const handleSubmit = async () => {
    const result = await apiStore.sendResetPasswordMail(email.value);
    if (result && result.success) {
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