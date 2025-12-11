<template>
    <div class="shadow-xl/30 w-[13vw] h-[94vh] bg-gray-900 flex flex-col border-r border-b border-gray-800 rounded-br-lg flex-shrink-0 pt-5">
        <UserInput 
            @search="handleSearchUser($event.username, $event.code)"
            @error="notificationStore.add($event, 'error')"
        />
        <br />
        <DiscussionWaitingButton :discussionsLength="waitingDiscussions.length" :isWaiting="isWaiting" />
        <DiscussionPreview
            v-for="discussion in validDiscussions" 
            :key="discussion._id" 
            :discussion="discussion"
        />
    </div>
</template>

<script setup>
import DiscussionWaitingButton from '~/components/pages/discussion/DiscussionButton.vue';
import DiscussionPreview from '@/components/pages/discussion/DiscussionPreview.vue';
import UserInput from '~/components/users/usersInput.vue';

import { usePrivateDiscussionsStore } from '#imports';
import { useNotificationStore } from '#imports';
import { useNavigationStore } from '#imports';
import { useApiStore } from '#imports';

const privateDiscussionsStore = usePrivateDiscussionsStore();
const notificationStore = useNotificationStore();
const navigationStore = useNavigationStore();
const apiStore = useApiStore();

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