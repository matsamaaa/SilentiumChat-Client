<template>
  <div
    :class="[
      'flex items-center justify-center rounded-full bg-indigo-200 overflow-hidden',
      props.userId ? 'w-16 h-16' : 'w-10 h-10'
    ]"
  >
    <img
      v-if="avatarUrl"
      :src="avatarUrl"
      alt="Avatar"
      :class="[
        'object-cover rounded-full h-full w-full p-[0.125rem]',
        props.userId ? 'w-[3.75rem] h-[3.75rem]' : 'w-19 h-19'
      ]"
    >
    <span v-else-if="userId" class="text-lg font-semibold text-indigo-800">
      {{ username ? props.username.trim().charAt(0).toUpperCase() : '?' }}
    </span>
    <span v-else class="text-lg font-semibold text-indigo-800">
      {{ userStore.user.username ? userStore.user.username.trim().charAt(0).toUpperCase() : '?' }}
    </span>
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
  },
  username: {
    type: String,
    default: ''
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
