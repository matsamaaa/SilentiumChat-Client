<template>
    <div class="flex flex-row items-center justify-end">
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
            <RemoveFriendButton 
                v-if="user.status === 'accepted'" 
                :user-id="user.userId" />
        </div>
        <AskFriendButton 
            v-if="!user || user.status === 'rejected'" 
            :user-id="userId"
            :username="username" />
        <BlockFriendButton 
            v-if="!user || user.status !== 'blocked'" 
            :user-id="userId"
            :username="username" />
        <UnblockFriendButton 
            v-if="user && user.status === 'blocked'" 
            :user-id="userId"
            :username="username" />
    </div>
</template>

<script setup>
import { useUserStore } from '#imports';

// components
import CancelFriendButton from '~/components/buttons/friends/CancelFriendButton.vue';
import AcceptFriendButton from '~/components/buttons/friends/AcceptFriendButton.vue';
import RefuseFriendButton from '~/components/buttons/friends/RefuseFriendButton.vue';
import AskFriendButton from '~/components/buttons/friends/AskFriendButton.vue';
import RemoveFriendButton from '~/components/buttons/friends/RemoveFriendButton.vue';
import BlockFriendButton from '~/components/buttons/friends/BlockFriendButton.vue';
import UnblockFriendButton from '~/components/buttons/friends/UnblockFriendButton.vue';

const props = defineProps({
    username: {
        type: String,
        required: false
    }
});

const route = useRoute();
const userId = route.params.id;
const username = ref(props.username);

const userStore = useUserStore();
const user = computed(() => userStore.getFriendStatus(userId));
</script>