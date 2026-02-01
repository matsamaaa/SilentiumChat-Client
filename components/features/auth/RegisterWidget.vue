<template>
    <div class="flex items-center justify-center h-[93vh] w-full">

        <form 
            @submit.prevent="handleRegister"
            class="bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl w-full max-w-sm flex flex-col items-stretch gap-6 border border-gray-700">

            <h1 class="text-3xl font-extrabold text-white mb-2 text-center">Sign Up</h1>

            <NormalInput
                v-model="email"
                type="email"
                placeholder="Email"
                required
                />

            <NormalInput
                v-model="username"
                type="text"
                placeholder="Username"
                required
                />

            <NormalInput
                v-model="tagModel"
                type="text"
                placeholder="Tag (e.g., 0000)"
                inputmode="numeric"
                autocomplete="off"
                required
                maxlength="4"
                @keydown="onTagKeydown"
                @paste="onTagPaste"
                />

            <NormalInput
                v-model="password"
                type="password"
                placeholder="Password"
                required
                />
            
            <NormalInput
                v-model="passwordConfirmation"
                type="password"
                placeholder="Confirm Password"
                required
                />

            <!-- Links -->
            <div class="flex flex-col w-full text-sm text-center gap-2 mt-2">
                <router-link to="/login" class="text-sm text-indigo-400 hover:text-indigo-300 transition duration-150 mt-2">
                    Already have an account? Login
                </router-link>
            </div>

            <NormalButton
                type="submit"
                label="Register"
                class="w-full"
                />
        </form>

    </div>
</template>

<script setup>
import NormalInput from '~/components/ui/inputs/NormalInput.vue';
import NormalButton from '~/components/ui/buttons/NormalButton.vue';

import { useUserStore } from '#imports';

const userStore = useUserStore();

const email = ref('');
const username = ref('');
const tag = ref('0000');
const password = ref('');
const passwordConfirmation = ref('');

const normalizeTag = (value) => {
    const digitsOnly = String(value ?? '').replace(/\D/g, '');
    const lastFour = digitsOnly.slice(-4);
    return lastFour.padStart(4, '0');
}

const tagModel = computed({
    get: () => tag.value,
    set: (value) => {
        tag.value = normalizeTag(value);
    }
});

const onTagKeydown = (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    const key = event.key;
    if (!/^\d$/.test(key)) return;

    const input = event.target;
    const selectionStart = input?.selectionStart;
    const selectionEnd = input?.selectionEnd;

    // If user is replacing a selection, let the browser handle it.
    if (selectionStart != null && selectionEnd != null && selectionStart !== selectionEnd) return;

    // When already 4 chars and no selection: implement "rolling" (drop first, append new digit)
    if ((tag.value?.length ?? 0) >= 4) {
        event.preventDefault();
        tag.value = normalizeTag(`${tag.value}${key}`);
    }
}

const onTagPaste = (event) => {
    const pasted = event.clipboardData?.getData('text') ?? '';
    const digitsOnly = String(pasted).replace(/\D/g, '');
    if (!digitsOnly) return;

    event.preventDefault();
    tag.value = normalizeTag(`${tag.value}${digitsOnly}`);
}

const handleRegister = async () => {
    try {
        await userStore.register(
            email.value,
            username.value,
            tag.value,
            password.value,
            passwordConfirmation.value
        );
    } catch (err) {
        console.error('Registration error:', err);
    }
}
</script>