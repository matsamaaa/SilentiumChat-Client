<template>
    <div class="shadow-xl/30 w-[13vw] h-[94vh] bg-gray-900 flex flex-col border-r border-b border-gray-800 rounded-br-lg flex-shrink-0">
        <br />
        <UserInput 
            @search="handleSearchUser"
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

const privateDiscussionsStore = usePrivateDiscussionsStore();
const notificationStore = useNotificationStore();

const route = useRoute();
const searchError = ref(null);

const isWaiting = computed(() => route.query.waiting);
const discussions = computed(() => privateDiscussionsStore.discussions);
const waitingDiscussions = computed(() => discussions.value.filter(d => d.isWaitingForResponse == null));
const validDiscussions = computed(() => isWaiting.value === 'true' ? discussions.value.filter(d => d.isWaitingForResponse == null) : discussions.value.filter(d => d.isWaitingForResponse == true)  );
</script>