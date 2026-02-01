<template>
    <div>

        <h3 class="text-xl font-semibold text-gray-100 border-b border-gray-700 pb-2">Fake Password</h3>
        <p class="text-gray-500 text-sm gap py-2">Set up a fake password to delete your data when you use it.</p>

        <form @submit.prevent="updateFakePassword" class="space-y-2 w-full sm:w-96">

            <label for="current-password" class="block text-sm font-medium text-gray-300">Real Password</label>
            <NormalInput
                id="current-password"
                type="password"
                v-model="currentPassword"
                placeholder="Enter your real password"
                required=true
                />

            <label for="fake-password" class="block text-sm font-medium text-gray-300">Fake Password</label>
            <NormalInput
                id="fake-password"
                type="password"
                v-model="fakePassword"
                placeholder="Enter your fake password"
                required=true
                />

            <label for="confirm-password" class="block text-sm font-medium text-gray-300">Confirm Fake Password</label>
            <NormalInput
                id="confirm-password"
                type="password"
                v-model="confirmPassword"
                placeholder="Confirm your fake password"
                required=true
                />

            <NormalButton
                type="submit"
                label="Update Password"
                icon="wrench"
                />
        </form>
    </div>
</template>

<script setup>
import NormalButton from '~/components/ui/buttons/NormalButton.vue';
import NormalInput from '~/components/ui/inputs/NormalInput.vue';

import { useApiStore, useNotificationStore } from '#imports';

const notificationStore = useNotificationStore();
const apiStore = useApiStore();

const currentPassword = ref(null);
const fakePassword = ref(null);
const confirmPassword = ref(null);

const updateFakePassword = async () => {
    if(!currentPassword.value || !fakePassword.value || !confirmPassword.value) {
        notificationStore.add({
            message: 'All fields are required.',
            type: 'error'
        });
        return;
    }

    const response = await apiStore.updateFakePassword(fakePassword.value, confirmPassword.value, currentPassword.value);
    if (!response.success) {
        notificationStore.add({
            message: response.message,
            type: 'error'
        });
    }

    currentPassword.value = null;
    fakePassword.value = null;
    confirmPassword.value = null;
};
</script>