<template>
    <div class="flex flex-col w-screen h-[93vh] p-5">
        <h1 class="text-3xl font-bold mb-6 text-white">Friend Management</h1>

        <div class="flex border-b border-gray-300 mb-6">
            <button
                @click="setActiveTab('accepted')"
                :class="{'border-indigo-500 text-indigo-600': activeTab === 'accepted', 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': activeTab !== 'friends'}"
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

        <div class="flex-1 overflow-y-auto bg-gray-800  p-4 rounded-lg shadow">
            <UserList 
                v-if="activeTab === 'accepted'" 
                listType="accepted"
            />
            <UserList 
                v-else-if="activeTab === 'pending'" 
                listType="pending"
            />
            <UserList 
                v-else-if="activeTab === 'blocked'" 
                listType="blocked"
            />
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import UserList from '@/components/pages/friends/UserList.vue';

const activeTab = ref('accepted'); // 'accepted', 'pending', 'blocked'

const setActiveTab = (tab) => {
    activeTab.value = tab;
};
</script>