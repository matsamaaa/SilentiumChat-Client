<template>
    <div 
        v-if="userStore.user"
        @click="goToMessaging"
        class="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors duration-200"
    >
        <div class="flex flex-col">
            <p class="font-semibold text-white">{{ discussion.encryptedMessages[0]?.username || 'Utilisateur' }}</p>
            <p class="text-gray-400 text-sm truncate max-w-xs">
                {{ lastMessage ? lastMessage : 'File' }}
            </p>
        </div>
        <div class="text-gray-500 text-xs">
            {{ timestamp }}
        </div>
    </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
import { useNavigationStore } from '@/stores/navigation'

const props = defineProps({
    discussion: { type: Object, required: true }
})

const userStore = useUserStore()
const navigationStore = useNavigationStore()

const lastMessage = computed(() => {
    const msg = props.discussion.encryptedMessages[0]
    if (!msg) return ''
    return msg.from === userStore.user.uniqueId ? msg.encryptedMessageBySender : msg.encryptedMessage
})

const timestamp = computed(() => {
    const msg = props.discussion.encryptedMessages[0]
    if (!msg?.timestamp) return ''
    return new Date(msg.timestamp).toLocaleTimeString()
})

const goToMessaging = () => {
    const msg = props.discussion.encryptedMessages[0]
    if (!msg) return
    const userId = msg.from === userStore.user.uniqueId ? msg.to : msg.from
    navigationStore.goToMessaging(userId)
}
</script>