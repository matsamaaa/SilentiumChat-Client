<template>
    <div class="flex items-center justify-center h-[93vh] w-full">

        <form 
            @submit.prevent="handleLogin"
            class="bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl w-full max-w-sm flex flex-col items-stretch gap-6 border border-gray-700">

            <h1 class="text-3xl font-extrabold text-white mb-2 text-center">Login</h1>

            <NormalInput
                v-model="email"
                type="email"
                placeholder="Email"
                required
                />

            <NormalInput
                v-model="password"
                type="password"
                placeholder="Password"
                required
                />

            <!-- Links -->
            <div class="flex flex-col w-full text-sm text-center gap-2 mt-2">
                <router-link to="/register" class="text-indigo-400 hover:text-indigo-300 transition duration-150">
                    Don't have an account? Register
                </router-link>
                
                <router-link to="/password/forgot" class="text-indigo-400 hover:text-indigo-300 transition duration-150">
                    Forgot Password?
                </router-link>
            </div>

            <NormalButton
                type="submit"
                label="Login"
                class="w-full"
                />

        </form>

    </div>
</template>

<script setup>
import NormalInput from '~/components/ui/inputs/NormalInput.vue';

import { useUserStore } from '#imports';
import NormalButton from '~/components/ui/buttons/NormalButton.vue';

const userStore = useUserStore();

const email = ref('');
const password = ref('');

const handleLogin = async () => {
    try {
        await userStore.login(
            email.value,
            password.value
        );
    } catch (err) {
        console.error('Login error:', err);
    }
}
</script>