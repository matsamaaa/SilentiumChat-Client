<template>
    <div class="flex items-center justify-center h-[93vh] w-full">

        <form 
            @submit.prevent="handleResetPassword"
            class="bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl w-full max-w-sm flex flex-col items-stretch gap-6 border border-gray-700">

            <h1 class="text-3xl font-extrabold text-white mb-2 text-center">Reset Password</h1>

            <NormalInput
                v-model="newPassword"
                type="password"
                placeholder="New Password"
                required
                minlength="8"
                />

            <NormalInput
                v-model="confirmPassword"
                type="password"
                placeholder="Confirm New Password"
                required
                minlength="8"
                />

            <NormalButton
                type="submit"
                :disabled="!passwordMatch || newPassword.length < 8"
                label="Set New Password"
                />

            <router-link to="/login" class="text-sm text-indigo-400 hover:text-indigo-300 transition duration-150 mt-2">
                &larr; Back to Login
            </router-link>

        </form>
    </div>
</template>

<script setup>
import NormalInput from '~/components/ui/inputs/NormalInput.vue';
import NormalButton from '~/components/ui/buttons/NormalButton.vue';

import { useApiStore, useNavigationStore } from '#imports';
import { isSamePassword } from '#imports';

const route = useRoute();
const apiStore = useApiStore();
const navigationStore = useNavigationStore();

const token = ref(route.query.token || '');
const id = ref(route.query.id || '');
const newPassword = ref('');
const confirmPassword = ref('');

const passwordMatch = computed(() => {
    return isSamePassword(newPassword.value, confirmPassword.value);
});

const handleResetPassword = async () => {
    const response = await apiStore.sendChangePasswordMail(id.value, token.value, newPassword.value, confirmPassword.value);
    if (response.success) navigationStore.goToLogin();
};
</script>