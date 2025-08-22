<template>
    <div>
        <form @submit.prevent="handleRegister" class="flex flex-col justify-center items-center gap-3 h-[93vh]">
            <h1 class="text-2xl font-bold">Sign Up</h1>
            <input v-model="email" type="email" placeholder="Email" required />
            <input v-model="username" type="text" placeholder="Username" required />
            
            <!-- Tag : toujours 4 chiffres -->
            <input 
                v-model="tag" 
                type="text" 
                placeholder="0000" 
                maxlength="5"
                @input="formatTag"
                required 
            />

            <input v-model="password" type="password" placeholder="Password" required />
            <input v-model="passwordConfirmation" type="password" placeholder="Password Confirmation" required />

            <p v-if="error" class="text-red-500">{{ error }}</p>

            <button type="submit" @onClick="handleRegister">Register</button>
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
        console.log('test')
        error.value = err.message; // affichera le message renvoyé par ton backend
    }
}
</script>
