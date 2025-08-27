<template>
    <div class="flex flex-col static overflow-y-scroll h-[86vh]">
        <h1>{{ recipientUsername }}</h1>
        <MessageOutput v-for="(msg, index) in filteredDiscussions" :key="index" :msg="msg" />
        <MessageInput @send="handleSend" class="absolute bottom-0 left-0 right-0" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import MessageInput from '@/components/messages/MessageInput.vue'
import MessageOutput from '@/components/messages/MessageOutput.vue'
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

const handleSend = (data) => {
    webSocketStore.wsSendMessage(id, data.message, data.file);
}

const privateDiscussionsStore = usePrivateDiscussionsStore();

const filteredDiscussions = computed(() => {
    const discussion = privateDiscussionsStore.getDiscussion(
        userStore.user.uniqueId,
        route.params.id
    );

    if (!discussion) {
        return null;
    }
    console.log(discussion.encryptedMessages);
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
                    return await privateDiscussionsStore.addMessageToDiscussion(msg);
                })
            );
        } catch (error) {
            console.error("Error decrypting messages:", error);
        }
    }
});
</script>