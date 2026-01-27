<template>
    <div class="space-y-6">
        <h3 class="text-xl font-semibold text-gray-100 border-b border-gray-700 pb-2">Change Password</h3>
    
        <form @submit.prevent="updatePassword" class="space-y-4 w-full sm:w-96">

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

            <div>
                <label for="new-password" class="block text-sm font-medium text-gray-300">New Password</label>
                <input 
                    type="password" 
                    id="new-password" 
                    v-model="newPassword"
                    placeholder="Enter a new password (min. 8 characters)"
                    autocomplete="new-password"
                    required
                    class="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
            </div>

            <div>
                <label for="confirm-password" class="block text-sm font-medium text-gray-300">Confirm New Password</label>
                <input 
                    type="password" 
                    id="confirm-password" 
                    v-model="confirmPassword"
                    placeholder="Confirm your new password"
                    autocomplete="new-password"
                    required
                    class="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
            </div>

            <button 
                type="submit" 
                class="mt-2 w-full px-4 py-2 text-sm font-medium rounded-lg transition duration-150 sm:w-auto"
            >
                <span>Update Password</span>
            </button>
        </form>
    </div>
</template>

<script setup>
import { useApiStore } from '#imports';

const apiStore = useApiStore();

const currentPassword = ref(null);
const newPassword = ref(null);
const confirmPassword = ref(null);

const errorMessage = ref(null);

const updatePassword = async () => {
    if(!currentPassword.value || !newPassword.value || !confirmPassword.value) {
        errorMessage.value = "All fields are required.";
        return;
    }

    const response = await apiStore.updatePassword(newPassword.value, confirmPassword.value, currentPassword.value);
    if (!response.success) {
        errorMessage.value = response.message;
    } else {
        errorMessage.value = null;
    }

    currentPassword.value = null;
    newPassword.value = null;
    confirmPassword.value = null;
};

</script>