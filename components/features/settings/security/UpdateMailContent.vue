<template>
    <div>
        <h3 class="text-xl font-semibold text-gray-100 border-b border-gray-700 pb-2">Update Email</h3>
        <p class="text-gray-500 text-sm py-2">Change your account's email address here.</p>
        
        <form @submit.prevent="updateEmail" class="space-y-2 w-full sm:w-96">

            <label for="new-email" class="block text-sm font-medium text-gray-300">New Email</label>
            <NormalInput
                id="new-email"
                type="email"
                v-model="newEmail"
                placeholder="Enter your new email address"
                required=true
                />

            <label for="current-password" class="block text-sm font-medium text-gray-300">Current Password</label>
            <NormalInput
                id="current-password"
                type="password"
                v-model="currentPassword"
                placeholder="Enter your current password"
                required=true
                />

            <NormalButton
                type="submit"
                label="Send Email Verification"
                icon="paper-plane"
                />

        </form>
    </div>
</template>

<script setup>
import NormalButton from '~/components/ui/buttons/NormalButton.vue';
import NormalInput from '~/components/ui/inputs/NormalInput.vue';

import { useUserStore, useApiStore, useNotificationStore } from '#imports';

const notificationStore = useNotificationStore();
const apiStore = useApiStore();
const userStore = useUserStore();

const newEmail = ref('');
const currentPassword = ref('');

const updateEmail = async () => {
    if(!newEmail.value || !currentPassword.value) {
        notificationStore.add({
            message: 'Both fields are required.',
            type: 'error'
        });
        return;
    }
    
    const response = await apiStore.sendChangeEmailMail(userStore.user.uniqueId, newEmail.value, currentPassword.value);
    if (!response.success) {
        notificationStore.add({
            message: response.message,
            type: 'error'
        });
    }

    newEmail.value = null;
    currentPassword.value = null;
};

</script>