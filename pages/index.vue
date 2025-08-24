<template>
    <div class="flex flex-col gap-2 p-4 bg-gray-900 h-full w-1/4 overflow-y-auto">
        <DiscussionItem 
            v-for="discussion in discussions" 
            :key="discussion._id" 
            :discussion="discussion"
        />
    </div>
</template>

<script setup>
import { usePrivateDiscussionsStore } from '@/stores/privateDiscussions';
import { useApiStore } from '@/stores/api';
import { useUserStore } from '@/stores/user';
import { useNavigationStore } from '@/stores/navigation';
import DiscussionItem from '@/components/discussion/DiscussionPreview.vue';

const privateDiscussionsStore = usePrivateDiscussionsStore();
const apiStore = useApiStore();
const navigationStore = useNavigationStore();
const userStore = useUserStore();

const discussions = computed(() => privateDiscussionsStore.discussions);

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
        console.log("Discussion loaded:", privateDiscussionsStore.discussions);
    });
})
</script>