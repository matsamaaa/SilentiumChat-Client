<template>
    <div class="flex flex-row w-full justify-between h-full">
        <MessagesBar />

        <div v-if="isLoading" class="flex-1 flex justify-center items-center">
            <Loading />
        </div>

        <div v-else class="flex flex-col justify-between overflow-y-auto w-full">
            <div
                ref="out"
                class="flex flex-col justify-start overflow-y-auto px-1 h-[93vh]"
                @scroll="handleScroll"
            >
                <p v-if="filteredDiscussions[0].isFirstMessage" class="flex flex-row justify-center items-center py-2 text-gray-500">Start of chat</p>
                <MessageOutput
                    v-for="(msg, index) in filteredDiscussions"
                    :key="index"
                    :msg="msg"
                />
            </div>

            <MessageInput
                v-if="
                    !discussion ||
                    discussion?.isWaitingForResponse === true ||
                    filteredDiscussions?.[0]?.from === userStore.user.uniqueId
                "
                @send="handleSend"
                class="w-full overflow-hidden"
            />

            <div
                v-if="
                    filteredDiscussions?.[0]?.from != userStore.user.uniqueId &&
                    discussion?.isWaitingForResponse === null
                "
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
        <UserBar
            :id="id"
            :username="recipientUsername"
            :tag="recipientTag"
            :creationDate="recipientCreationDate"
        />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import MessageInput from '@/components/pages/messages/MessageInput.vue'
import MessageOutput from '@/components/pages/messages/MessageOutput.vue'
import StatusDiscussion from '@/components/pages/messages/StatusDiscussion.vue'
import { useWebSocketStore } from '@/stores/ws'
import { useApiStore } from '@/stores/api'
import { useUserStore } from '@/stores/user'
import { usePrivateDiscussionsStore } from '~/stores/privateDiscussions'
import { useRoute } from 'vue-router'
import UserBar from '~/components/pages/messages/UserBar.vue'
import Loading from '~/components/Loading.vue'
import MessagesBar from '~/components/pages/layouts/MessagesBar.vue'

const recipientUsername = ref('');
const recipientTag = ref('');
const recipientCreationDate = ref('');

const isLoading = ref(true);
const isFetchingNextPage = ref(false);
const page = ref(1);
const out = ref(null);

const webSocketStore = useWebSocketStore();
const apiStore = useApiStore();
const userStore = useUserStore();
const privateDiscussionsStore = usePrivateDiscussionsStore();
const route = useRoute();

const id = route.params.id;

const discussion = computed(() =>
    privateDiscussionsStore.getDiscussion(userStore.user.uniqueId, id)
);

const handleSend = (data) => {
    webSocketStore.wsSendMessage(id, data.message, data.file)
}

const filteredDiscussions = computed(() => {
    return discussion.value?.encryptedMessages ?? []
})

const refreshDiscussion = async () => {
    await privateDiscussionsStore.loadMessagesPage(id, 1);
}

// Scroll
watch(
    () => filteredDiscussions.value.length,
    async (newLength, oldLength) => {
        const el = out.value
        if (!el || newLength === oldLength) return

        const shouldScroll =
            oldLength === 0 || el.scrollHeight - el.clientHeight <= el.scrollTop + 5

        await nextTick()

        const mediaElements = el.querySelectorAll('img, video')
        const mediaPromises = Array.from(mediaElements).map(
            (media) =>
                new Promise((resolve) => {
                    if (media.complete && (media.tagName !== 'VIDEO' || media.readyState >= 2)) {
                        resolve()
                    } else {
                        media.addEventListener('load', resolve, { once: true })
                        media.addEventListener('loadeddata', resolve, { once: true })
                    }
                })
        )

        await Promise.all(mediaPromises)

        if (shouldScroll) {
            el.scrollTop = el.scrollHeight - el.clientHeight
        }
    },
    { immediate: true }
)

const handleScroll = () => {
    const el = out.value;
    if (!el || isFetchingNextPage.value) return;

    if (el.scrollTop == 0) {
        page.value += 1;
    }
}

watch(page, async (newPage, oldPage) => {
    if (newPage <= oldPage) return;

    isFetchingNextPage.value = true;
    const el = out.value;
    const oldScrollHeight = el.scrollHeight;
    
    await privateDiscussionsStore.loadMessagesPage(id, newPage);
    
    await nextTick();

    const newScrollHeight = el.scrollHeight;
    el.scrollTop = newScrollHeight - oldScrollHeight; 
    
    isFetchingNextPage.value = false;
});


onMounted(async () => {
    isLoading.value = true;

    recipientUsername.value = await apiStore.getUsername(id);
    recipientTag.value = await apiStore.getUserTag(id);
    recipientTag.value = recipientTag.value.toString().padStart(4, '0');
    recipientCreationDate.value = await apiStore.getUserCreationDate(id);

    await privateDiscussionsStore.loadMessagesPage(id, page.value);

    isLoading.value = false;
})
</script>