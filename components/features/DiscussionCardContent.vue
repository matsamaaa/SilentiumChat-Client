<template>
    <div 
        @click="goToMessaging"
        class="flex flex-col items-start justify-between py-2 pl-2 pr-2 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors duration-200 overflow-hidden"
    >
        <div class="flex flex-row gap-1">
            <p class="font-semibold text-white truncate w-full">{{ discussion.username || 'Unknow' }}</p>
            <StatusIcon :userId="userId" />
        </div>
        <p class="text-gray-500 text-sm truncate w-full">
            {{ lastMessage ? lastMessage : 'File' }}
        </p>
        <p class="text-gray-500 text-xs truncate w-full">{{ timestamp }}</p>
    </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
import { useNavigationStore } from '@/stores/navigation'
import StatusIcon from '../ui/icons/StatusIcon.vue'

const props = defineProps({
    discussion: { type: Object, required: true },
})

const userStore = useUserStore()
const navigationStore = useNavigationStore()

const userId = computed(() => {
    const users = props.discussion.users;
    if (users[0] != userStore.user.uniqueId) return users[0];
    else return users[1];
})

onMounted(() => {
    // Ensure we have the latest status for the user in this discussion
    const statusStore = useStatusStore();
    statusStore.initializeStatus(userId.value);
});

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