<template>
    <div        
        :class="[
            deviceStore.isTablet ? 'w-[30vw]' : '', 
            deviceStore.isMobile ? 'w-[85vw]' : '',
            deviceStore.isDesktop ? 'w-[13vw]' : ''
        ]"
        class="shadow-xl/30 h-[94vh] bg-gray-900 flex flex-col gap-2 border-r border-b border-gray-800 rounded-br-lg flex-shrink-0 pt-5 px-3 pb-3">
        
        <SearchInput
            v-model="query"
            @search="searchUser"
            placeholder="username#0001"
            :required="true"
            />

        <NormalButton 
            v-if="deviceStore.isMobile"
            type="button"
            @execute="navigationStore.goToFriends()"
            label="Friends"
            textSize="sm"
            />

        <NormalButton 
            type="button"
            @execute="!isWaiting ? navigationStore.goToWaitingMessages() : navigationStore.goToHome()"
            :label="isWaiting ? 'Back To All Messages' :  `Messages Requests (${waitingDiscussions.length})`"
            textSize="sm"
            icon="fa-paper-plane"
            />

        <DiscussionCardContent
            v-if="userStore.user"
            v-for="discussion in validDiscussions" 
            :key="discussion._id" 
            :discussion="discussion"
        />

    </div>
</template>

<script setup>
import NormalButton from '~/components/ui/buttons/NormalButton.vue';
import SearchInput from '~/components/ui/inputs/SearchInput.vue';
import DiscussionCardContent from '~/components/features/DiscussionCardContent.vue';

import {
    useDeviceStore, 
    useUserStore, 
    useNavigationStore, 
    useNotificationStore, 
    usePrivateDiscussionsStore,
    useApiStore
} from '#imports';

const deviceStore = useDeviceStore();
const userStore = useUserStore();
const navigationStore = useNavigationStore();
const notificationStore = useNotificationStore();
const privateDiscussionsStore = usePrivateDiscussionsStore();
const apiStore = useApiStore();

const route = useRoute();

const isWaiting = computed(() => route.query.waiting);
const discussions = computed(() => privateDiscussionsStore.discussions);
const waitingDiscussions = computed(() => discussions.value.filter(d => d.isWaitingForResponse == null));
const validDiscussions = computed(() => isWaiting.value === 'true' ? discussions.value.filter(d => d.isWaitingForResponse == null) : discussions.value.filter(d => d.isWaitingForResponse == true)  );

const query = ref('');

const handleSearchUser = async (username, code) => {
    const userId = await apiStore.getUserIdByFullName(username, code);
    if (!userId) {
        notificationStore.add('User not found', 'error');
        return;
    }

    navigationStore.goToMessaging(userId);
}

const searchUser = async () => {
    const text = query.value.trim();
    if (!text) return;

    const match = text.match(/^([^#]+)#(\d{4})$/);
    if (!match) {
        notificationStore.add('Invalid format. Use: username#0001', 'error');
        return;
    }

    const username = match[1];
    const code = match[2];

    query.value = '';
    await handleSearchUser(username, code);
}
</script>