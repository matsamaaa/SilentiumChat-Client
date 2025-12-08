<template>
    <div class="space-y-6">
        <h3 class="text-xl font-semibold text-gray-100 border-b border-gray-700 pb-2">Change Email</h3>

        <form @submit.prevent="updateEmail" class="space-y-4 w-full sm:w-96">

            <div>
                <label for="new-email" class="block text-sm font-medium text-gray-300">New Email</label>
                <input
                    type="email"
                    id="new-email"
                    v-model="newEmail"
                    placeholder="Enter your new email address"
                    autocomplete="email"
                    required
                    class="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
            </div>

            <div>
                <label for="current-password" class="block text-sm font-medium text-gray-300">Current Password</label>
                <input
                    type="password"
                    id="current-password"
                    v-model="currentPassword"
                    placeholder="Enter your current password"
                    autocomplete="current-password"
                    required
                    class="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
            </div>

            <button
                type="submit"
                class="mt-2 w-full px-4 py-2 text-sm font-medium rounded-lg transition duration-150 sm:w-auto"
            >
                <span>Send Mail Verification</span>
            </button>
        </form>
    </div>
</template>

<script setup>
import { useApiStore, useUserStore } from '#imports';

const apiStore = useApiStore();
const userStore = useUserStore();

const newEmail = ref(null);
const currentPassword = ref(null);

const errorMessage = ref(null);

const updateEmail = async () => {
    if(!newEmail.value || !currentPassword.value) {
        errorMessage.value = "Both fields are required.";
        return;
    }
    
    const response = await apiStore.sendChangeEmailMail(userStore.user.uniqueId, newEmail.value, currentPassword.value);
    if (!response.success) {
        errorMessage.value = response.message;
        newEmail.value = null;
        currentPassword.value = null;
    } else {
        errorMessage.value = null;
        newEmail.value = null;
        currentPassword.value = null;
    }
};
</script>