<template>
    <div class="flex flex-col h-full static">
        <h1>{{ recipientUsername }}</h1>
        <div v-for="(msg, index) in filteredDiscussions" :key="index">
            <p v-if="msg.from === userStore.user.uniqueId" class="text-right">
                {{ msg.encryptedMessageBySender }}
            </p>
            <p v-else class="text-left">
                {{ msg.encryptedMessage }}
            </p>
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
import { usePrivateDiscussionsStore } from '~/stores/privateDiscussions'

const recipientUsername = ref('')

const webSocketStore = useWebSocketStore()
const apiStore = useApiStore()
const userStore = useUserStore()
const route = useRoute()

const id = route.params.id

const handleSend = (msg) => {
    webSocketStore.wsSendMessage(id, msg);
}

const privateDiscussionsStore = usePrivateDiscussionsStore();

const filteredDiscussions = computed(() => {
    const discussion = privateDiscussionsStore.getDiscussion(
        userStore.user.uniqueId,
        route.params.id
    );

    if (!discussion) {
        console.log("Filtered discussion: Aucune discussion trouvée (encore vide)");
        return null;
    }

    console.log("Filtered discussion:", discussion);
    return discussion.encryptedMessages ?? null;
});

onMounted(async () => {
    //get username
    recipientUsername.value = await apiStore.getUsername(id);

    // delete old messages
    const privateDiscussionsStore = usePrivateDiscussionsStore();
    privateDiscussionsStore.removeDiscussion(id, userStore.user.uniqueId);

    // add all messages to discussion
    const messagesData = await apiStore.getPrivateDiscussion(userStore.user.uniqueId, id);
    if (messagesData) {
        // decrypt all messages
        try {
            messagesData.encryptedMessages = await Promise.all(
                messagesData.encryptedMessages.map(async (msg) => {
                    await privateDiscussionsStore.addMessageToDiscussion(msg);
                })
            );
        } catch (error) {
            console.error("Error decrypting messages:", error);
        }
    }
});
</script>