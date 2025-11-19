<template>
    <div>
        <div v-if="user" class="flex space-x-2">
            <div v-if="user.status === 'pending'">
                <CancelFriendButton 
                    v-if="user.hasAsk" 
                    :user-id="user.userId" />
                <AcceptFriendButton 
                    v-if="!user.hasAsk"
                    :user-id="user.userId" />
                <RefuseFriendButton 
                    v-if="!user.hasAsk"
                    :user-id="user.userId" />
            </div>
            <AcceptFriendButton 
                v-if="user.status === 'accepted' && user.hasAsk" 
                :user-id="user.userId" />
            <AskFriendButton 
                v-if="!user.status || user.status === 'rejected'" 
                :user-id="user.userId" />
        </div>
    </div>
</template>

<script setup>

import { useUserStore } from '#imports';

// components
import CancelFriendButton from '~/components/friends/CancelFriendButton.vue';
import AcceptFriendButton from '~/components/friends/AcceptFriendButton.vue';
import RefuseFriendButton from '~/components/friends/RefuseFriendButton.vue';
import AskFriendButton from '~/components/friends/AskFriendButton.vue';

const route = useRoute();
const userId = route.params.id;

const userStore = useUserStore();
const user = computed(() => userStore.getFriendStatus(userId));
</script>