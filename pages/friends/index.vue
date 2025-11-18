<template>
    <div class="flex flex-col w-screen h-[93vh] p-5">
        <h1 class="text-3xl font-bold mb-6 text-white">Friend Management</h1>

        <div class="flex border-b border-gray-300 mb-6">
            <button
                @click="setActiveTab('friends')"
                :class="{'border-indigo-500 text-indigo-600': activeTab === 'friends', 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': activeTab !== 'friends'}"
                class="px-4 py-2 text-sm font-medium border-b-2 focus:outline-none transition duration-150 ease-in-out"
            >
                My Friends
            </button>
            <button
                @click="setActiveTab('pending')"
                :class="{'border-indigo-500 text-indigo-600': activeTab === 'pending', 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': activeTab !== 'pending'}"
                class="px-4 py-2 text-sm font-medium border-b-2 focus:outline-none transition duration-150 ease-in-out"
            >
                Pending
            </button>
            <button
                @click="setActiveTab('blocked')"
                :class="{'border-indigo-500 text-indigo-600': activeTab === 'blocked', 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': activeTab !== 'blocked'}"
                class="px-4 py-2 text-sm font-medium border-b-2 focus:outline-none transition duration-150 ease-in-out"
            >
                Blocked
            </button>
        </div>

        <div v-if="isLoading" class="flex-1 flex justify-center items-center">
            <p>Loading lists...</p>
        </div>

        <div v-else class="flex-1 overflow-y-auto bg-gray-800  p-4 rounded-lg shadow">
            <UserList 
                v-if="activeTab === 'friends'" 
                :users="friends" 
                listType="friend"
                @action-success="fetchLists"
            />
            <UserList 
                v-else-if="activeTab === 'pending'" 
                :users="pending" 
                listType="pending"
                @action-success="fetchLists"
            />
            <UserList 
                v-else-if="activeTab === 'blocked'" 
                :users="blocked" 
                listType="blocked"
                @action-success="fetchLists"
            />

            <p v-if="currentList.length === 0" class="text-gray-500 italic">
                No users in this list.
            </p>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue';
import { useApiStore } from '@/stores/api';
import UserList from '@/components/friends/UserList.vue';

const apiStore = useApiStore();

const activeTab = ref('friends'); // 'friends', 'pending', 'blocked'
const isLoading = ref(true);

const friends = ref([]);
const pending = ref([]);
const blocked = ref([]);

const currentList = computed(() => {
    if (activeTab.value === 'friends') return friends.value;
    if (activeTab.value === 'pending') return pending.value;
    if (activeTab.value === 'blocked') return blocked.value;
    return [];
});

const setActiveTab = (tab) => {
    activeTab.value = tab;
};

const fetchLists = async () => {
    isLoading.value = true;
    try {
        friends.value = await apiStore.getFriendsList();  
        pending.value = await apiStore.getPendingRequests();
        //blocked.value = await apiStore.getBlockedUsers();
    } catch (error) {
        console.error(error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchLists();
});
</script>