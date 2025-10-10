<template>
  <div class="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
    <template v-if="avatarUrl">
      <img
        :src="avatarUrl"
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
import { ref, watchEffect } from 'vue'
import { useUserStore } from '@/stores/user'
import { useApiStore } from '@/stores/api'

const userStore = useUserStore()
const apiStore = useApiStore()

const props = defineProps({
  userId: {
    type: String,
    default: null
  }
})

const avatarUrl = ref(null)

watchEffect(async () => {
  if (props.userId) {
    try {
      avatarUrl.value = await apiStore.getAvatar(props.userId)
    } catch (e) {
      avatarUrl.value = null
    }
  } else {
    avatarUrl.value = userStore.avatar
  }
})
</script>
