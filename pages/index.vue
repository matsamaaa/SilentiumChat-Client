<template>
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
    <div>
        <MessagesBar />
    </div>
</template>

<script setup>
import { usePrivateDiscussionsStore } from '@/stores/privateDiscussions';
import { useApiStore } from '@/stores/api';
import { useUserStore } from '@/stores/user';
import { useNavigationStore } from '@/stores/navigation';
import DiscussionWaitingButton from '~/components/pages/discussion/DiscussionButton.vue';
import UserInput from '~/components/users/usersInput.vue';
import MessagesBar from '~/components/pages/layouts/MessagesBar.vue';
import DiscussionPreview from '@/components/pages/discussion/DiscussionPreview.vue';

const privateDiscussionsStore = usePrivateDiscussionsStore();
const apiStore = useApiStore(); 
const navigationStore = useNavigationStore();
const userStore = useUserStore();

const route = useRoute();

const discussions = computed(() => privateDiscussionsStore.discussions);
const waiting = computed(() => route.query.waiting);
const messagesList = computed(() => {
    if (waiting.value === 'true') {
        return discussions.value.filter(d => d.isWaitingForResponse == null);
    }

    return discussions.value.filter(d => d.isWaitingForResponse == true);
});
const error = ref(null);

const handleSearchUser = async ({ username, code }) => {
    try {
        const id = await apiStore.getUserIdByFullName(username, code);
        if (!id) {
            error.value = "Invalid user";
            return;
        }
        navigationStore.goToMessaging(id);
    } catch (err) {
        console.error(err)
        error.value = "Error occurred during search";
    }
}

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