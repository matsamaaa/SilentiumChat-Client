<template>
    <div class="flex space-x-2">

        <MessageFriendButton
            v-if="['accepted', 'pending'].includes(tab) && !isMessaging"
            :userId="userId"
            />
        <CancelFriendButton
            v-if="['pending'].includes(tab) && hasAsk"
            :userId="userId"
            />
        <AcceptFriendButton
            v-if="['pending'].includes(tab) && !hasAsk"
            :userId="userId"
            />
        <RefuseFriendButton
            v-if="['pending'].includes(tab) && !hasAsk"
            :userId="userId"
            />
        <RemoveFriendButton
            v-if="['accepted'].includes(tab)"
            :userId="userId"
            />
        <BlockFriendButton
            v-if="!['blocked'].includes(tab)"
            :userId="userId"
            />
        <UnblockFriendButton
            v-if="['blocked'].includes(tab)"
            :userId="userId"
            />
        <AskFriendButton
            v-if="!['accepted', 'pending', 'blocked'].includes(tab)"
            :userId="userId"
            />
    </div>
</template>

<script setup>
import MessageFriendButton from '~/components/ui/buttons/friends/MessageFriendButton.vue';
import CancelFriendButton from '~/components/ui/buttons/friends/CancelFriendButton.vue';
import AcceptFriendButton from '~/components/ui/buttons/friends/AcceptFriendButton.vue';
import RefuseFriendButton from '~/components/ui/buttons/friends/RefuseFriendButton.vue';
import RemoveFriendButton from '~/components/ui/buttons/friends/RemoveFriendButton.vue';
import BlockFriendButton from '~/components/ui/buttons/friends/BlockFriendButton.vue';
import UnblockFriendButton from '~/components/ui/buttons/friends/UnblockFriendButton.vue';
import AskFriendButton from '~/components/ui/buttons/friends/AskFriendButton.vue';

const props = defineProps({
    userId: {
        type: String,
        required: true
    },
    hasAsk: {
        type: Boolean,
        required: true
    },
    tab: {
        type: String,
        required: true
    },
    isMessaging: {
        type: Boolean,
        required: false,
        default: false
    }
});
</script>