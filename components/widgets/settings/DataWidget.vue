<template>
    <div>
        <section class="bg-gray-800 p-6 h-full rounded-xl shadow-xl space-y-8">
            <div>
                <h2 class="text-xl font-semibold text-gray-100 mb-4 border-b border-gray-700 pb-2">Fake Password</h2>
                <p class="text-sm text-gray-500">Set up a fake password to delete your data when you use it.</p>
            </div>

            <UpdateFakePasswordForm  />

            <hr class="border-gray-700">

            <div>
                <h2 class="text-xl font-semibold text-gray-100 mb-4 border-b border-gray-700 pb-2">Delete Data</h2>
                <p class="text-sm text-gray-500">Delete your data permanently from our servers and from your device, this action can't be undone.</p>
            </div>
            <RedButton text="Reset Data's account" @execute="userStore.clearAllDatas()" />
        </section>
    </div>
</template>

<script setup>
import RedButton from '~/components/buttons/RedButton.vue';
import UpdateFakePasswordForm from '~/components/forms/settings/UpdateFakePasswordForm.vue';
import { useUserStore } from '#imports';

const userStore = useUserStore();
</script>