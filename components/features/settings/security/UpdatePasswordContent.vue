<template>
    <div>
        <h3 class="text-xl font-semibold text-gray-100 border-b border-gray-700 pb-2">Update Password</h3>
        <p class="text-gray-500 text-sm py-2">Change your account's password here.</p>
        
        <form @submit.prevent="updatePassword" class="space-y-2 w-full sm:w-96">

            <label for="current-password" class="block text-sm font-medium text-gray-300">Current Password</label>
            <NormalInput
                id="current-password"
                type="password"
                v-model="currentPassword"
                placeholder="Enter your current password"
                required=true
                />

            <label for="new-password" class="block text-sm font-medium text-gray-300">New Password</label>
            <NormalInput
                id="new-password"
                type="password"
                v-model="newPassword"
                placeholder="Enter your new password"
                required=true
                />

            <label for="confirm-new-password" class="block text-sm font-medium text-gray-300">Confirm New Password</label>
            <NormalInput
                id="confirm-new-password"
                type="password"
                v-model="confirmNewPassword"
                placeholder="Confirm your new password"
                required=true
                />

            <NormalButton
                type="submit"
                label="Update Password"
                class="mt-2 w-full px-4 py-2 text-sm font-medium rounded-lg transition duration-150 sm:w-auto"
                />

        </form>
    </div>
</template>

<script setup>
import NormalButton from '~/components/buttons/NormalButton.vue';
import NormalInput from '~/components/ui/inputs/NormalInput.vue';

import { useApiStore, useNotificationStore } from '#imports';

const notificationStore = useNotificationStore();
const apiStore = useApiStore();

const currentPassword = ref('');
const newPassword = ref('');
const confirmNewPassword = ref('');

const updatePassword = async () => {
    if(!currentPassword.value || !newPassword.value || !confirmNewPassword.value) {
        notificationStore.add({
            message: 'All fields are required.',
            type: 'error'
        });
        return;
    }

    const response = await apiStore.updatePassword(newPassword.value, confirmNewPassword.value, currentPassword.value);
    if (!response.success) {
        notificationStore.add({
            message: response.message,
            type: 'error'
        });
    }

    currentPassword.value = null;
    newPassword.value = null;
    confirmNewPassword.value = null;
};
</script>