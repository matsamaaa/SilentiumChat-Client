<template>
    <div>
        <div 
            v-for="user in users" 
            :key="user.userId" 
            class="flex items-center justify-between p-4 my-2 bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition duration-300 ease-in-out"
        >

            <FriendCardContent
                :userId="user.userId"
                :username="user.username" 
                :createdAt="user.createdAt"
                :tab="props.tab"
            />

            <FriendButtonChoiceContent
                :userId="user.userId"
                :tab="props.tab"
                :hasAsk="user.hasAsk"
                />
        </div>

        <p 
            v-if="users.length < 1"
            class="text-sm font-medium text-gray-500 mb-2 px-4">
        <br />
            No friends found.
        </p>

    </div>
</template>

<script setup>
import FriendCardContent from '~/components/features/friends/FriendCardContent.vue';
import FriendButtonChoiceContent from '~/components/features/friends/FriendButtonChoiceContent.vue';

import { useUserStore } from '#imports';

const userStore = useUserStore();

const props = defineProps({
    tab: {
        type: String,
        default: 'accepted'
    }
});

const users = computed(() => userStore.friends[props.tab]);
</script>