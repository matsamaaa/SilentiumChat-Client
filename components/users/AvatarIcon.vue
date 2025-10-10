<template>
  <div class="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
    <template v-if="userStore.avatar">
      <img
        :src="userStore.avatar"
        alt="Avatar"
        class="w-9 h-9 object-cover rounded-full"
      >
    </template>
    <template v-else>
      <span class="text-lg font-semibold text-gray-700">
        {{ userStore.user.username ? userStore.user.username.trim().charAt(0).toUpperCase() : '?' }}
      </span>
    </template>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
</script>
