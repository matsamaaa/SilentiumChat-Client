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

        <DiscussionsWidget v-if="!deviceStore.isDisabledMessagesBar" />
        <LoadingIcon v-if="isLoading" />

        <div v-if="!isLoading" class="flex flex-col justify-between overflow-y-auto w-full">
            <div
                ref="out"
                class="flex flex-col justify-start overflow-y-auto px-1 h-[93vh]"
                @scroll="handleScroll"
            >

                <p 
                    v-if="filteredDiscussions && filteredDiscussions.length > 0 && filteredDiscussions[0].isFirstMessage" 
                    class="flex flex-row justify-center items-center py-2 text-gray-500">
                    Start of chat
                </p>
                <MessageContent
                    v-for="(msg, index) in filteredDiscussions"
                    :message="msg"
                    :isOwnMessage="msg.from === userStore.user.uniqueId"
                    :key="index"
                />

            </div>

            <!-- Message Input -->
            <MessageInput
                v-if="!discussion || discussion?.isWaitingForResponse || [filteredDiscussions?.[0]?.from].includes(userStore.user.uniqueId)"
                @send="handleSend"
                />

            <ToggleDiscussionStatusContent
                v-if="
                    filteredDiscussions?.[0]?.from != userStore.user.uniqueId &&
                    discussion?.isWaitingForResponse === null
                "
                :userId="id"
                @updated="refreshDiscussion"
                />

        </div>
        
        <!-- Arrow Profile Slide-->
        <div
            v-if="!deviceStore.isDesktop && !isUserBarVisible"
            class="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-800/50 p-2 rounded-l-lg animate-pulse">
                <FontAwesomeIcon :icon="['fas', 'chevron-left']" class="h-6 w-6 text-white" />
        </div>

        <!-- Profile -->
        <transition name="slide-right">
            <div
                v-if="deviceStore.isDesktop || isUserBarVisible"
                :class="{
                    'absolute right-0 top-0 h-full z-10 w-[20vw]': deviceStore.isTablet,
                    'absolute right-0 top-0 h-full z-10 w-[85vw]': deviceStore.isMobile,

                }"
            >
                <ProfileCardContent
                    :id="id"
                    :username="discussion?.username || 'Unknown User'"
                    :tag="discussion?.tag || '0000'"
                    :creationDate="discussion?.creationDate || ''"
                />
            </div>
        </transition>
    </div>
</template>

<script setup>
import LoadingIcon from '~/components/ui/icons/LoadingIcon.vue';
import DiscussionsWidget from '~/components/features/DiscussionsWidget.vue';
import MessageContent from '~/components/features/messages/MessageContent.vue';
import MessageInput from '~/components/features/messages/MessageInput.vue';
import ProfileCardContent from '~/components/features/messages/ProfileCardContent.vue';
import ToggleDiscussionStatusContent from '~/components/features/messages/ToggleDiscussionStatusContent.vue';

import { useDeviceStore, usePrivateDiscussionsStore, useUserStore, useWebSocketStore, useApiStore } from '#imports';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const deviceStore = useDeviceStore();
const privateDiscussionsStore = usePrivateDiscussionsStore();
const userStore = useUserStore();
const webSocketStore = useWebSocketStore();
const apiStore = useApiStore();

const route = useRoute();

const id = route.params.id;
const isLoading = ref(false);
const isFetchingNextPage = ref(false);
const page = ref(1);
const out = ref(null);

const isMouseDown = ref(false);
const touchStartX = ref(0);
const touchEndX = ref(0);
const isUserBarVisible = ref(false);

const recipientUsername = ref('');
const recipientTag = ref('');
const recipientCreationDate = ref('');

const discussion = computed(() =>
    privateDiscussionsStore.getDiscussion(userStore.user.uniqueId, id)
);

const filteredDiscussions = computed(() => {
    return discussion.value?.encryptedMessages ?? []
})

const handleSend = (data) => {
    webSocketStore.wsSendMessage(id, data.message, data.file)
}

const refreshDiscussion = async () => {
    await privateDiscussionsStore.loadMessagesPage(id, 1);
}

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

// SCROLL TO BOTTOM WHEN NEW MESSAGE ARRIVES
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

watch(() => route.params.id, () => {
    if (!deviceStore.isDesktop) {
        isUserBarVisible.value = false;
    }
});

watch(() => deviceStore.isMobile, (isMobile) => {
    deviceStore.isDisabledMessagesBar = isMobile;
    deviceStore.isDisabledProfilePlate = isMobile;
});

onUnmounted(() => {
    deviceStore.isDisabledMessagesBar = false;
    deviceStore.isDisabledProfilePlate = false;
});

onMounted(async () => {
    if (deviceStore.isMobile) {
        deviceStore.isDisabledMessagesBar = true
        deviceStore.isDisabledProfilePlate = true
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