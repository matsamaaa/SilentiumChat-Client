<template>
    <div class="flex flex-row w-screen justify-between h-[93vh]">
        <div class="flex flex-col justify-center items-center w-[15vw] border-r-2 border-gray-300 p-5">
            <AvatarIcon :userId="id" />
            <h1>{{ recipientUsername }}</h1>
            <FriendsButton 
                :id="id" 
                :friendStatus="friendStatus" 
                :friendDoc="friendDoc"
                @updateStatus="updateFriendStatus"
                @updateDoc="updateFriendDoc"
            />
        </div>

        <div v-if="isLoading" class="flex-1 flex justify-center items-center">
            <p>Chargement de la discussion...</p>
        </div>

            <div
            v-else
            class="flex flex-col static overflow-y-scroll h-[86vh] flex-1"
            >
            <MessageOutput
                v-for="(msg, index) in filteredDiscussions"
                :key="index"
                :msg="msg"
            />

            <MessageInput
                v-if="discussionData?.isWaitingForResponse === true || filteredDiscussions?.[0]?.from === userStore.user.uniqueId"
                @send="handleSend"
                :friendStatus="friendStatus"
                :friendDoc="friendDoc"
                class="absolute bottom-0 right-0 w-[84.5vw] overflow-hidden"
            />

            <div
                v-if="filteredDiscussions?.[0]?.from != userStore.user.uniqueId && discussionData?.isWaitingForResponse === null"
                class="flex flex-row justify-center gap-3 h-full items-end"
            >
                <StatusDiscussion
                :user="id"
                status="accepted"
                @updated="refreshDiscussion"
                />
                <StatusDiscussion
                :user="id"
                status="refused"
                @updated="refreshDiscussion"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import MessageInput from '@/components/messages/MessageInput.vue'
import MessageOutput from '@/components/messages/MessageOutput.vue'
import StatusDiscussion from '@/components/messages/StatusDiscussion.vue'
import { useWebSocketStore } from '@/stores/ws'
import { useApiStore } from '@/stores/api'
import { useUserStore } from '@/stores/user'
import { usePrivateDiscussionsStore } from '~/stores/privateDiscussions'
import { useRoute } from 'vue-router'
import FriendsButton from '@/components/messages/FriendsButton.vue'
import AvatarIcon from '~/components/users/AvatarIcon.vue'

const recipientUsername = ref('')
const discussionData = ref(null)
const isLoading = ref(true)

const webSocketStore = useWebSocketStore()
const apiStore = useApiStore()
const userStore = useUserStore()
const privateDiscussionsStore = usePrivateDiscussionsStore()
const route = useRoute()

const id = route.params.id
const friendStatus = ref(null);
const friendDoc = ref(null);

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

const updateFriendStatus = async (status) => {
    friendStatus.value = status
}

const updateFriendDoc = async (doc) => {
    friendDoc.value = doc
}

onMounted(async () => {
    isLoading.value = true
    recipientUsername.value = await apiStore.getUsername(id)

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
    isLoading.value = false

    const statusDoc = await apiStore.getFriendStatus(id);
    friendStatus.value = statusDoc.status;
    friendDoc.value = statusDoc.doc;
})
</script>
