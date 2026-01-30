<template>
    <div
        class="relative flex flex-row w-full justify-between h-full"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
        @mouseleave="handleMouseLeave"
    >
        <MessagingSideBar v-if="!deviceStore.isDisabledMessagesBar" />

        <div v-if="isLoading" class="flex-1 flex justify-center items-center">
            <Loading />
        </div>

        <div v-else class="flex flex-col justify-between overflow-y-auto w-full">
            <div
                ref="out"
                class="flex flex-col justify-start overflow-y-auto px-1 h-[93vh]"
                @scroll="handleScroll"
            >
                <p v-if="filteredDiscussions && filteredDiscussions.length > 0 && filteredDiscussions[0].isFirstMessage" class="flex flex-row justify-center items-center py-2 text-gray-500">Start of chat</p>
                <MessageCard
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
                <DiscussionStatusButton
                    :user="id"
                    status="refused"
                    @updated="refreshDiscussion"
                />
                <DiscussionStatusButton
                    :user="id"
                    status="accepted"
                    @updated="refreshDiscussion"
                />
            </div>
        </div>
        <div
            v-if="!deviceStore.isDesktop && !isUserBarVisible"
            class="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-800/50 p-2 rounded-l-lg animate-pulse"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 19l-7-7 7-7"
                />
            </svg>
        </div>
        <transition name="slide-right">
            <div
                v-if="deviceStore.isDesktop || isUserBarVisible"
                :class="{
                    'absolute right-0 top-0 h-full z-10 w-[20vw]': deviceStore.isTablet,
                    'absolute right-0 top-0 h-full z-10 w-[85vw]': deviceStore.isMobile,

                }"
            >
                <UserCard
                    :id="id"
                    :username="recipientUsername"
                    :tag="recipientTag"
                    :creationDate="recipientCreationDate"
                />
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import MessageInput from '@/components/inputs/MessageInput.vue'
import DiscussionStatusButton from '@/components/buttons/discussion/DiscussionStatusButton.vue'
import { useWebSocketStore } from '@/stores/ws'
import { useApiStore } from '@/stores/api'
import { useUserStore } from '@/stores/user'
import { usePrivateDiscussionsStore } from '~/stores/privateDiscussions'
import { useDeviceStore } from '#imports'
import { useRoute } from 'vue-router'
import UserCard from '~/components/cards/user/UserCard.vue'
import Loading from '~/components/Loading.vue'
import MessagingSideBar from '~/components/sidebars/MessagingSideBar.vue'
import MessageCard from '~/components/cards/message/MessageCard.vue'

const isUserBarVisible = ref(false);
const touchStartX = ref(0);
const touchEndX = ref(0);

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
const deviceStore = useDeviceStore();
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

// Swipe
const handleTouchStart = (event) => {
    if (deviceStore.isDesktop) return;
    touchStartX.value = event.touches[0].clientX;
    touchEndX.value = 0;
}

const handleTouchMove = (event) => {
    if (deviceStore.isDesktop) return;
    touchEndX.value = event.touches[0].clientX;
}

const handleTouchEnd = () => {
    if (deviceStore.isDesktop || !touchEndX.value) return;

    const diff = touchStartX.value - touchEndX.value;
    const minSwipeDistance = 50;

    if (Math.abs(diff) > minSwipeDistance) {
        if (diff > 0) {
            isUserBarVisible.value = true;
        } else {
            isUserBarVisible.value = false;
        }
    }
    
    touchStartX.value = 0;
    touchEndX.value = 0;
}

const isMouseDown = ref(false);

const handleMouseDown = (event) => {
    if (deviceStore.isDesktop) return;
    isMouseDown.value = true;
    touchStartX.value = event.clientX;
    touchEndX.value = 0;
}

const handleMouseMove = (event) => {
    if (deviceStore.isDesktop || !isMouseDown.value) return;
    touchEndX.value = event.clientX;
}

const handleMouseUp = () => {
    if (deviceStore.isDesktop || !isMouseDown.value) return;
    isMouseDown.value = false;
    handleTouchEnd();
}

const handleMouseLeave = () => {
    if (isMouseDown.value) {
        handleMouseUp();
    }
}

watch(() => route.params.id, () => {
    if (!deviceStore.isDesktop) {
        isUserBarVisible.value = false;
    }
});

watch(() => deviceStore.isMobile, (isMobile) => {
    deviceStore.isDisabledMessagesBar = isMobile;
});

onUnmounted(() => {
    deviceStore.isDisabledMessagesBar = false;
});

onMounted(async () => {
    if (deviceStore.isMobile) {
        deviceStore.isDisabledMessagesBar = true
    }

    isLoading.value = true;

    recipientUsername.value = await apiStore.getUsername(id);
    recipientTag.value = await apiStore.getUserTag(id);
    recipientTag.value = recipientTag.value.toString().padStart(4, '0');
    recipientCreationDate.value = await apiStore.getUserCreationDate(id);

    await privateDiscussionsStore.loadMessagesPage(id, page.value);

    isLoading.value = false;
})
</script>