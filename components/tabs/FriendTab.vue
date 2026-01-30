<template>
    <div class="flex flex-col p-5 w-full gap-4">
        <div class="flex flex-row gap-4">
            <button
                @click="setActiveTab('accepted')"
                :class="{'bg-indigo-600': activeTab === 'accepted'}"
                class="text-white p-2 rounded-lg"
            >
                My Friends
            </button>
            <button
                @click="setActiveTab('pending')"
                :class="{'bg-indigo-600': activeTab === 'pending'}"
                class="text-white p-2 rounded-lg"
            >
                Pending
            </button>
            <button
                @click="setActiveTab('blocked')"
                :class="{'bg-indigo-600': activeTab === 'blocked'}"
                class="text-white p-2 rounded-lg"
            >
                Blocked
            </button>
        </div>

        <div>
            <FriendsList 
                v-if="activeTab === 'accepted'" 
                listType="accepted"
            />
            <FriendsList 
                v-else-if="activeTab === 'pending'" 
                listType="pending"
            />
            <FriendsList 
                v-else-if="activeTab === 'blocked'" 
                listType="blocked"
            />
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import FriendsList from '@/components/lists/FriendsList.vue';
const activeTab = ref('accepted'); // 'accepted', 'pending', 'blocked'

const setActiveTab = (tab) => {
    activeTab.value = tab;
};
</script>