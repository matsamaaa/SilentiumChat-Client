<template>
  <div>
    <section class="bg-gray-800 p-6 rounded-xl shadow-xl space-y-8">
      
      <div>
        <h2 class="text-xl font-semibold text-gray-100 mb-4 border-b border-gray-700 pb-2">Security Settings</h2>
        <p class="text-sm text-gray-400">Manage your account's security and privacy settings.</p>
      </div>
        <ChangePasswordForm />

      <hr class="border-gray-700">
      
    </section>
  </div>
</template>

<script setup>
import ChangePasswordForm from '@/components/settings/others/ChangePassword.vue';
</script>