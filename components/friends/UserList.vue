<template>
    <div class="p-1">
        <div v-if="usersWithNames.length === 0 && props.users.length > 0 && isLoadingUsernames" class="text-center p-4">
            <p class="text-gray-500">Loading usernames...</p>
        </div>
        
        <div v-else>
            <div 
                v-for="user in usersWithNames" 
                :key="user.id" 
                class="flex items-center justify-between p-4 my-2 bg-gray-900 rounded-lg shadow-sm hover:shadow-md transition duration-300 ease-in-out"
            >
                <UserCard 
                    :username="user.username" 
                    :createdAt="user.createdAt"
                    :userId="user.targetId"
                    :listType="listType"
                />
                
                <div class="flex space-x-2">
                    <button v-if="listType === 'pending'" @click="handleApiFriend(user.targetId, 'accepted')" class="text-green-500 hover:text-green-700 px-3 p-2 rounded-full hover:bg-green-50 transition">
                        <FontAwesomeIcon icon="user-check" />
                    </button>
                    <button v-if="listType === 'pending'" @click="handleApiFriend(user.targetId, 'rejected')" class="text-red-500 hover:text-red-700 px-3 p-2 rounded-full hover:bg-red-50 transition">
                        <FontAwesomeIcon icon="user-xmark" />
                    </button>
                    <button v-if="listType === 'friend'" @click="handleApiFriend(user.targetId, 'remove')" class="text-indigo-500 hover:text-indigo-700 px-3 py-2 rounded-full hover:bg-indigo-50 transition">
                        <FontAwesomeIcon icon="user-xmark" />
                    </button>
                </div>
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
    users: {
        type: Array,
        required: true
    },
    listType: {
        type: String,
        required: true
    }
});

const apiStore = useApiStore();
const userStore = useUserStore();
const usersWithNames = ref([]);
const isLoadingUsernames = ref(true);

const handleApiFriend = async (userId, status) => {
    if (status === 'remove') await apiStore.removeFriend(userId);
    if (status === 'rejected') await apiStore.refuseFriendRequest(userId);
    if (status === 'accepted') await apiStore.acceptFriendRequest(userId);

    handleRemoveUserFromList(userId);
};

const handleRemoveUserFromList = async (userId) => {
    usersWithNames.value = usersWithNames.value.filter(user => user.targetId !== userId);
};

onMounted(async () => {
    try {
        usersWithNames.value = await Promise.all(
            props.users.map(async user => {
                const targetId = userStore.user.uniqueId !== user.userId ? user.userId : user.friendId;
                const username = await apiStore.getUsername(targetId);

                return {
                    ...user,
                    targetId,
                    username
                };
            })
        );
    } catch (error) {
        console.error("Error fetching usernames:", error);
    } finally {
        isLoadingUsernames.value = false;
    }
});
</script>