<template>
    <div class="flex items-center justify-center h-[93vh] w-full"> 
        
        <form @submit.prevent="handleLogin" 
              class="bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl w-full max-w-sm 
                     flex flex-col items-center gap-6 border border-gray-700">

            <h1 class="text-3xl font-extrabold text-white mb-2">
                Login
            </h1>
            
            <input 
                v-model="email" 
                type="email" 
                placeholder="Email" 
                required 
                class="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white 
                       focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 placeholder-gray-400"
            />
            
            <input 
                v-model="password" 
                type="password" 
                placeholder="Password" 
                required 
                class="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white 
                       focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 placeholder-gray-400"
            />

            <div v-if="error" class="w-full p-3 bg-red-900/50 text-red-300 rounded-lg text-center font-medium border border-red-600">
                {{ error }}
            </div>
            
            <div class="flex flex-col w-full text-sm text-center gap-2 mt-2">
                <router-link to="/register" class="text-indigo-400 hover:text-indigo-300 transition duration-150">
                    Don't have an account? Register
                </router-link>
                
                <router-link to="/password/forgot" class="text-indigo-400 hover:text-indigo-300 transition duration-150">
                    Forgot Password?
                </router-link>
            </div>

            <button 
                type="submit"
                class="w-full py-3 px-4 rounded-lg font-semibold text-white transition duration-200 uppercase tracking-wider bg-indigo-600 hover:bg-indigo-500 mt-4"
            >
                Login
            </button>

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