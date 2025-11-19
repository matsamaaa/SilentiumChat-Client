<template>
    <div class="p-1">        
        <div>
            <div 
                v-for="user in users" 
                :key="user.userId" 
                class="flex items-center justify-between p-4 my-2 bg-gray-900 rounded-lg shadow-sm hover:shadow-md transition duration-300 ease-in-out"
            >
                <UserCard 
                    :username="user.username" 
                    :createdAt="user.createdAt"
                    :userId="user.userId"
                    :listType="listType"
                />
                
                <div class="flex space-x-2">
                    <div v-if="listType === 'pending'">
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
                        v-if="listType === 'accepted' && user.hasAsk" 
                        :user-id="user.userId" />
                </div>
            </div>
            <div v-if="users.length < 1">
                <p class="text-gray-500 italic text-center mt-4">
                    No users in this list.
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import UserCard from './UserCard.vue';
import { useUserStore } from '#imports';


// components
import CancelFriendButton from '@/components/friends/CancelFriendButton.vue';
import RemoveFriendButton from '@/components/friends/RemoveFriendButton.vue';
import RefuseFriendButton from '@/components/friends/RefuseFriendButton.vue';
import AcceptFriendButton from '~/components/friends/AcceptFriendButton.vue';


const props = defineProps({
    listType: {
        type: String,
        required: true
    }
});

const userStore = useUserStore();

const users = computed(() => userStore.friends[props.listType]);

</script>