<template>
    <div>
        <form @submit.prevent="handleSubmit" class="flex flex-col justify-center items-center gap-3 h-[93vh]">
             <h1 class="text-2xl font-bold">Forgot Password</h1>
            <input v-model="email" type="email" placeholder="Email" required />
            
            <button type="submit">Send Mail</button>
        </form>
    </div>
</template>

<script setup>
import { useApiStore } from '../stores/api';

const apiStore = useApiStore();
const email = ref('');

const handleSubmit = async () => {
    await apiStore.sendResetPasswordMail(email.value);
}
</script>