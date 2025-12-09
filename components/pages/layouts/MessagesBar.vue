<template>
    <div class="shadow-xl/30 w-[13vw] h-[94vh] bg-gray-900 flex flex-col border-r border-b border-gray-800 rounded-br-lg">
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
    <!--<div class="flex flex-row gap-0">
        <div class="flex flex-col gap-2 p-4 bg-gray-900 h-full w-1/4 overflow-y-auto">
            <DiscussionWaitingButton :waitingDiscussions="discussions.filter(d => d.isWaitingForResponse == null)" />
            <DiscussionItem 
                v-for="discussion in messagesList" 
                :key="discussion._id" 
                :discussion="discussion"
            />
        </div>
        <div class="w-full justify-center items-center flex flex-col p-4">
            <UserInput 
                @search="handleSearchUser"
                @error="error = $event"
            />
            <p v-if="error" class="text-red-500">{{ error }}</p>
        </div>
    </div>-->
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