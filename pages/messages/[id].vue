<template>
    <div class="flex flex-col h-full static">
        <h1>{{ recipientUsername }}</h1>
        <div v-for="discussion in filteredDiscussions" :key="discussion._id">
        <div v-for="(msg, index) in discussion.encryptedMessages" :key="index">
            <p v-if="msg.from === userStore.user.uniqueId" class="text-right">
            {{ msg.encryptedMessageBySender }}
            </p>
            <p v-else class="text-left">
            {{ msg.encryptedMessage }}
            </p>
        </div>
        </div>
        <MessageInput @send="handleSend" class="absolute bottom-0 left-0 right-0" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import MessageInput from '@/components/messages/MessageInput.vue'
import { useWebSocketStore } from '@/stores/ws'
import { useApiStore } from '@/stores/api'
import { useUserStore } from '@/stores/user'
import { decryptMessage } from '@/utils/messages'

const recipientUsername = ref('')

const webSocketStore = useWebSocketStore()
const apiStore = useApiStore()
const userStore = useUserStore()
const route = useRoute()

const id = route.params.id

const handleSend = (msg) => {
    webSocketStore.wsSendMessage(id, msg);
}

const filteredDiscussions = computed(() => 
    webSocketStore.messages.filter(
        d => d.users.includes(id) && d.users.includes(userStore.user.uniqueId)
    )
)

onMounted(async () => {
    //get username
    recipientUsername.value = await apiStore.getUsername(id);

    // delete old messages
    webSocketStore.messages = webSocketStore.messages.filter(
        d => !d.users.includes(id) || !d.users.includes(userStore.user.uniqueId)
    );

    const messagesData = await apiStore.getPrivateDiscussion(userStore.user.uniqueId, id);
    if (messagesData) {
        // decrypt all messages
        try {
            messagesData.encryptedMessages = await Promise.all(
                messagesData.encryptedMessages.map(async (msg) => {
                    if (msg.from === userStore.user.uniqueId) {
                        const decryptedBySender = await decryptMessage(msg.encryptedMessageBySender);
                        return { ...msg, encryptedMessageBySender: decryptedBySender };
                    }
                    const decrypted = await decryptMessage(msg.encryptedMessage);
                    return { ...msg, encryptedMessage: decrypted };
                })
            );
        } catch (error) {
            console.error("Error decrypting messages:", error);
        }

        // push the discussion to the store
        webSocketStore.messages.push(messagesData);
    }
});
</script>