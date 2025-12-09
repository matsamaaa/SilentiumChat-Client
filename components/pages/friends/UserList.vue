<template>
    <div>
        <div 
            v-for="user in users" 
            :key="user.userId" 
            class="flex items-center justify-between p-4 my-2 bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition duration-300 ease-in-out"
        >
            <UserCard
                :username="user.username" 
                :createdAt="user.createdAt"
                :userId="user.userId"
                :listType="listType"
            />
            
            <div class="flex space-x-2">
                <div v-if="listType === 'pending'">
                    <MessageFriendButton 
                        :user-id="user.userId" />
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
                <div v-if="listType === 'accepted' && user.hasAsk">
                    <MessageFriendButton 
                        :user-id="user.userId" />
                    <AcceptFriendButton 
                        :user-id="user.userId" />
                </div>
                <div v-if="listType === 'accepted'">
                    <MessageFriendButton 
                        :user-id="user.userId" />
                    <RemoveFriendButton 
                        :user-id="user.userId" />
                </div>
            </div>
        </div>
        <div v-if="users.length < 1">
            <p class="text-gray-500 italic text-center mt-4">
                No users in this list.
            </p>
        </div>
    </div>
</template>

<script setup>
import UserCard from './UserCard.vue';
import { useUserStore } from '#imports';
import { useNavigationStore } from '#imports';


// components
import CancelFriendButton from '@/components/friends/CancelFriendButton.vue';
import RemoveFriendButton from '@/components/friends/RemoveFriendButton.vue';
import RefuseFriendButton from '@/components/friends/RefuseFriendButton.vue';
import AcceptFriendButton from '~/components/friends/AcceptFriendButton.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import MessageFriendButton from '~/components/friends/MessageFriendButton.vue';


const props = defineProps({
    listType: {
        type: String,
        required: true
    }
});

const userStore = useUserStore();
const navigationStore = useNavigationStore();

const users = computed(() => userStore.friends[props.listType]);

</script>