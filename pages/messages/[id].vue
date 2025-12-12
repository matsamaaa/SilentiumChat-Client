<template>
    <div class="flex flex-row w-full justify-between h-full">
        <UserBar :id="id" :username="recipientUsername" :tag="recipientTag" :creationDate="recipientCreationDate" />

        <div v-if="isLoading" class="flex-1 flex justify-center items-center">
            <Loading />
        </div>

        <div
            v-else
            class="flex flex-col static overflow-y-scroll h-full w-full mx-1"
        >
            <MessageOutput
                v-for="(msg, index) in filteredDiscussions"
                :key="index"
                :msg="msg"
            />

            <MessageInput
                v-if="!discussionData || discussionData?.isWaitingForResponse === true || filteredDiscussions?.[0]?.from === userStore.user.uniqueId"
                @send="handleSend"
                class="absolute bottom-0 right-0 w-[82vw] overflow-hidden"
            />

            <div
                v-if="filteredDiscussions?.[0]?.from != userStore.user.uniqueId && discussionData?.isWaitingForResponse === null"
                class="flex flex-row justify-center gap-3 h-full items-end p-3"
            >
                <StatusDiscussion
                    :user="id"
                    status="refused"
                    @updated="refreshDiscussion"
                />
                <StatusDiscussion
                    :user="id"
                    status="accepted"
                    @updated="refreshDiscussion"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import MessageInput from '@/components/pages/messages/MessageInput.vue'
import MessageOutput from '@/components/pages/messages/MessageOutput.vue'
import StatusDiscussion from '@/components/pages/messages/StatusDiscussion.vue'
import { useWebSocketStore } from '@/stores/ws'
import { useApiStore } from '@/stores/api'
import { useUserStore } from '@/stores/user'
import { usePrivateDiscussionsStore } from '~/stores/privateDiscussions'
import { useRoute } from 'vue-router'
import UserBar from '~/components/pages/messages/UserBar.vue'
import Loading from '~/components/loading.vue'

const recipientUsername = ref('');
const recipientTag = ref('');
const recipientCreationDate = ref('');

const discussionData = ref(null);
const isLoading = ref(true);

const webSocketStore = useWebSocketStore();
const apiStore = useApiStore();
const userStore = useUserStore();
const privateDiscussionsStore = usePrivateDiscussionsStore();
const route = useRoute();

const id = route.params.id;

const handleSend = (data) => {
    webSocketStore.wsSendMessage(id, data.message, data.file)
}

const filteredDiscussions = computed(() => {
    const discussion = privateDiscussionsStore.getDiscussion(
        userStore.user.uniqueId,
        id
    )

    if (!discussion) return []

    discussionData.value = discussion
    return discussion.encryptedMessages ?? []
})

const refreshDiscussion = async () => {
    const messagesData = await apiStore.getPrivateDiscussion(id)
    if (messagesData) {
        discussionData.value = messagesData
    }
}

onMounted(async () => {
    isLoading.value = true
    recipientUsername.value = await apiStore.getUsername(id);
    recipientTag.value = await apiStore.getUserTag(id);
    recipientTag.value = recipientTag.value.toString().padStart(4, '0');
    recipientCreationDate.value = await apiStore.getUserCreationDate(id);

    privateDiscussionsStore.removeDiscussion(id, userStore.user.uniqueId)

    const messagesData = await apiStore.getPrivateDiscussion(id)

    if (messagesData) {
        try {
            messagesData.encryptedMessages = await Promise.all(
                messagesData.encryptedMessages.map(async (msg) => {
                    return await privateDiscussionsStore.addMessageToDiscussion(msg)
                })
            )
        } catch (error) {
            console.error('Error decrypting messages:', error)
        }
    }
    console.log('messagesData', messagesData);
    isLoading.value = false
})
</script>
