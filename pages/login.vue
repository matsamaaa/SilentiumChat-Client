<template>
    <div>
        <form @submit.prevent="handleLogin" class="flex flex-col justify-center items-center gap-3 h-[93vh]">
            <h1 class="text-2xl font-bold">Login</h1>
            <input v-model="email" type="email" placeholder="Email" required />
            <input v-model="password" type="password" placeholder="Password" required />

            <p v-if="error" class="text-red-500">{{ error }}</p>
            <a href="/register" class="text-blue-500">Don't have an account? Register</a>

            <button type="submit">Login</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

const email = ref('');
const password = ref('');
const error = ref(null);

const handleLogin = async () => {
    const userStore = useUserStore();
    try {
        await userStore.login(
            email.value,
            password.value
        );
    } catch (err) {
        error.value = err.message;
    }
}
</script>