<template>
    <div 
        :class="[
            deviceStore.isTablet ? 'w-[30vw]' : '', 
            deviceStore.isMobile ? 'w-[85vw]' : '',
            deviceStore.isDesktop ? 'w-[13vw]' : ''
        ]"
        class="shadow-xl/30 h-[94vh] bg-gray-900 flex flex-col border-r border-b border-gray-800 rounded-br-lg flex-shrink-0 pt-5">
        <UsernameInput 
                @search="handleSearchUser($event.username, $event.code)"
                @error="notificationStore.add($event, 'error')"
            />
        <br />
        <div 
            v-if="deviceStore.isMobile"
            @click="navigationStore.goToFriends"
            class="flex items-center justify-center rounded-lg cursor-pointer mx-2 py-2 hover:bg-gray-800 transition-colors duration-200"
        >
            <p class="font-semibold text-white">Friends</p>
        </div>
        <br v-if="deviceStore.isMobile" />
        <DiscussionWaitingButton :discussionsLength="waitingDiscussions.length" :isWaiting="isWaiting" />
        <DiscussionCard
            v-for="discussion in validDiscussions" 
            :key="discussion._id" 
            :discussion="discussion"
        />
    </div>
</template>

<script setup>
import DiscussionWaitingButton from '~/components/buttons/discussion/DiscussionButton.vue';
import DiscussionCard from '~/components/cards/discussion/DiscussionCard.vue';
import UsernameInput from '~/components/inputs/UsernameInput.vue';

import { usePrivateDiscussionsStore } from '#imports';
import { useNotificationStore } from '#imports';
import { useNavigationStore } from '#imports';
import { useApiStore } from '#imports';
import { useDeviceStore } from '#imports';

const privateDiscussionsStore = usePrivateDiscussionsStore();
const notificationStore = useNotificationStore();
const navigationStore = useNavigationStore();
const apiStore = useApiStore();
const deviceStore = useDeviceStore();

const route = useRoute();

const isWaiting = computed(() => route.query.waiting);
const discussions = computed(() => privateDiscussionsStore.discussions);
const waitingDiscussions = computed(() => discussions.value.filter(d => d.isWaitingForResponse == null));
const validDiscussions = computed(() => isWaiting.value === 'true' ? discussions.value.filter(d => d.isWaitingForResponse == null) : discussions.value.filter(d => d.isWaitingForResponse == true)  );

const handleSearchUser = async (username, code) => {
    const userId = await apiStore.getUserIdByFullName(username, code);
    if (!userId) {
        notificationStore.add('User not found', 'error');
        return;
    }

    navigationStore.goToMessaging(userId);
}
</script>