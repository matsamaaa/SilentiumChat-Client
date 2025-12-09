<template>
    <div class="flex flex-row">
        <MessagesBar />
        <FriendLayout />
    </div>
</template>

<script setup>
import { usePrivateDiscussionsStore } from '@/stores/privateDiscussions';
import { useApiStore } from '@/stores/api';
import { useUserStore } from '@/stores/user';
import MessagesBar from '~/components/pages/layouts/MessagesBar.vue';
import FriendLayout from '~/components/pages/layouts/FriendLayout.vue';

const privateDiscussionsStore = usePrivateDiscussionsStore();
const apiStore = useApiStore(); 
const userStore = useUserStore();

onMounted(async () => {
    const discussions = await apiStore.getLastMessages();
    discussions.map(async discussion => {
        privateDiscussionsStore.removeDiscussion(discussion['users'][1], discussion['users'][0]);
        privateDiscussionsStore.addDiscussion(discussion.users[0], discussion.users[1]);
        const username = discussion.encryptedMessages[0].from === userStore.user.uniqueId
            ? await apiStore.getUsername(discussion.encryptedMessages[0].to)
            : await apiStore.getUsername(discussion.encryptedMessages[0].from);
        privateDiscussionsStore.addMessageToDiscussion({
            ...discussion.encryptedMessages[0],
            username: username
        });
    });
})
</script>