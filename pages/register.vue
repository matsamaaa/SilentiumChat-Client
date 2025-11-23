<template>
    <div class="flex items-center justify-center h-[93vh] w-full"> 
        
        <form @submit.prevent="handleRegister" 
              class="bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl w-full max-w-sm 
                     flex flex-col items-center gap-6 border border-gray-700">

            <h1 class="text-3xl font-extrabold text-white mb-2">
                Sign Up
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
                v-model="username" 
                type="text" 
                placeholder="Username" 
                required 
                class="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white 
                       focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 placeholder-gray-400"
            />
            
            <input 
                v-model="tag" 
                type="text" 
                placeholder="Tag (e.g., 0000)" 
                maxlength="5"
                @input="formatTag"
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

            <input 
                v-model="passwordConfirmation" 
                type="password" 
                placeholder="Confirm Password" 
                required 
                class="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white 
                       focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 placeholder-gray-400"
            />

            <div v-if="error" class="w-full p-3 bg-red-900/50 text-red-300 rounded-lg text-center font-medium border border-red-600">
                {{ error }}
            </div>

            <button 
                type="submit"
                class="w-full py-3 px-4 rounded-lg font-semibold text-white transition duration-200 uppercase tracking-wider bg-indigo-600 hover:bg-indigo-500 mt-2"
            >
                Register
            </button>
            
            <router-link to="/login" class="text-sm text-indigo-400 hover:text-indigo-300 transition duration-150 mt-2">
                Already have an account? Login
            </router-link>

        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

const email = ref('');
const username = ref('');
const tag = ref('');
const password = ref('');
const passwordConfirmation = ref('');
const error = ref(null);

const formatTag = () => {
    tag.value = tag.value.replace(/\D/g, "");

    if (tag.value.split('').length > 4) {
        tag.value = tag.value.slice(-4);
    }

    tag.value = tag.value.padStart(4, "0").slice(0, 4);
}

const handleRegister = async () => {
    const userStore = useUserStore();
    try {
        await userStore.register(
            email.value,
            username.value,
            tag.value,
            password.value,
            passwordConfirmation.value
        );
    } catch (err) {
        error.value = err.message;
    }
}
</script>
