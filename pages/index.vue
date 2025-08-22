<template>
    <div class="flex flex-col h-full static">
        <div class="flex-1 overflow-y-auto p-2">
            <div v-for="(msg, index) in messages" :key="index">
                {{ msg }}
            </div>
        </div>
        <MessageInput @send="handleSend" class="absolute bottom-0 left-0 right-0" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import MessageInput from '@/components/messages/MessageInput.vue'
import { useUserStore } from '@/stores/user'
import { useNavigationStore } from '@/stores/navigation'

const messages = ref([])

const userStore = useUserStore()
const navigationStore = useNavigationStore()

const handleSend = (msg) => {
    messages.value.push(msg)
}

onMounted(() => {
    if (!userStore.isLoggedIn) {
        navigationStore.goToLogin();
    }
})
</script>
