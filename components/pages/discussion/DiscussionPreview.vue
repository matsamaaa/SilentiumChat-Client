<template>
    <div 
        v-if="userStore.user"
        @click="goToMessaging"
        class="flex flex-col items-start justify-between mx-2 py-2 pl-2 pr-2 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors duration-200 overflow-hidden"
    >
        <p class="font-semibold text-white truncate w-full">{{ discussion.encryptedMessages[0]?.username || 'Unknow' }}</p>
        <p class="text-gray-400 text-sm truncate w-full">
            {{ lastMessage ? lastMessage : 'File' }}
        </p>
        <p class="text-gray-500 text-xs truncate w-full">{{ timestamp }}</p>
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