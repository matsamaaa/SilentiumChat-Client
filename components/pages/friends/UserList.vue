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
                    <button v-if="listType === 'pending'" @click="handleApiFriend(user, 'accepted')" class="text-green-500 hover:text-green-700 px-3 p-2 rounded-full hover:bg-green-50 transition">
                        <FontAwesomeIcon icon="user-check" />
                    </button>
                    <button v-if="listType === 'pending'" @click="handleApiFriend(user, 'rejected')" class="text-red-500 hover:text-red-700 px-3 p-2 rounded-full hover:bg-red-50 transition">
                        <FontAwesomeIcon icon="user-xmark" />
                    </button>
                    <button v-if="listType === 'accepted'" @click="handleApiFriend(user, 'remove')" class="text-indigo-500 hover:text-indigo-700 px-3 py-2 rounded-full hover:bg-indigo-50 transition">
                        <FontAwesomeIcon icon="user-xmark" />
                    </button>
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
import { useApiStore } from '#imports';
import { useUserStore } from '#imports';
import { ref, onMounted } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';


const props = defineProps({
    listType: {
        type: String,
        required: true
    }
});

const apiStore = useApiStore();
const userStore = useUserStore();

const users = computed(() => userStore.friends[props.listType]);

const handleApiFriend = async (user, status) => {
    if (status === 'remove') {
        await apiStore.removeFriend(user.userId);
        return userStore.removeFriend(user.userId);
    }

    if (status === 'rejected') {
        await apiStore.refuseFriendRequest(user.userId);
        return userStore.removeFriend(user.userId);
    }

    if (status === 'accepted') {
        await apiStore.acceptFriendRequest(user.userId);
        userStore.removeFriend(user.userId);
        return userStore.addFriend(user)
    }
};
</script>