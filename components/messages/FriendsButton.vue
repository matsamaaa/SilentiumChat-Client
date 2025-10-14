<template>
    <div>
        <button 
            v-if="friendDoc?.isBlocked"
            @click="!friendDoc.isBlocked.includes(id) ? blockUser() : unblockUser()"
        >
            <FontAwesomeIcon :icon="['fas', 'ban']" />
        </button>
        <button
            v-if="friendStatus === 'rejected' || !friendStatus"
            @click="addFriend"
            class="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-xl hover:bg-blue-500 transition duration-150"
        >
            Add Friend 
            <FontAwesomeIcon :icon="['fa', 'user-plus']" />
        </button>
        <button
            v-else-if="friendStatus === 'pending' && friendDoc?.userId === userStore.user.uniqueId"
            disabled
            class="mt-4 px-4 py-2 bg-gray-400 text-white font-semibold rounded-lg shadow-xl cursor-not-allowed"
        >
            Friend Request Sent
            <FontAwesomeIcon :icon="['fa', 'clock']" />
        </button>
        <div 
            v-else-if="friendStatus === 'pending' && friendDoc?.userId != userStore.user.uniqueId"
            class="flex flex-col items-center justify-center"    
        >
            <button
                @click="acceptFriendRequest"
                class="mt-4 px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-xl"
            >
                Accept Friend
                <FontAwesomeIcon :icon="['fa', 'clock']" />
            </button>
            <button
                @click="refuseFriendRequest"
                class="mt-4 px-4 py-2 bg-red-400 text-white font-semibold rounded-lg shadow-xl"
            >
                Refuse Friend
                <FontAwesomeIcon :icon="['fa', 'clock']" />
            </button>
        </div>
        <button
            v-else-if="friendStatus === 'accepted'"
            disabled
            class="mt-4 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-xl cursor-not-allowed"
        >
            Friends
            <FontAwesomeIcon :icon="['fa', 'check']" />
        </button>
    </div>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useApiStore, useUserStore } from '#imports';

const props = defineProps({
    id: {
        type: String,
        required: true
    }
})

const apiStore = useApiStore();
const userStore = useUserStore();

const id = props.id;
const friendStatus = ref(null);
const friendDoc = ref(null);

const addFriend = async () => {
    try {
        await apiStore.sendFriendRequest(id);
        friendStatus.value = 'pending';
        friendDoc.value = { userId: userStore.user.uniqueId, status: 'pending' };
    } catch (error) {
        console.error('Error sending friend request:', error);
    }
}

const acceptFriendRequest = async () => {
    try {
        await apiStore.acceptFriendRequest(id);
        friendStatus.value = 'accepted';
    } catch (error) {
        console.error('Error accepting friend request:', error);
    }
}

const refuseFriendRequest = async () => {
    try {
        await apiStore.refuseFriendRequest(id);
        friendStatus.value = 'rejected';
    } catch (error) {
        console.error('Error refusing friend request:', error);
    }
}

const blockUser = async () => {
    try {
        console.log("Blocking user", id);
        await apiStore.blockUser(id);
        friendStatus.value = 'blocked';
        friendDoc.value = { ...friendDoc.value, isBlocked: [...(friendDoc.value?.isBlocked || []), id] };
    } catch (error) {
        console.error('Error blocking user:', error);
    }
}

const unblockUser = async () => {
    try {
        console.log("Unblocking user", id);
        await apiStore.unblockUser(id);
        friendStatus.value = 'rejected';
        friendDoc.value = { ...friendDoc.value, isBlocked: friendDoc.value?.isBlocked.filter(uid => uid !== id), status: 'rejected' };
    } catch (error) {
        console.error('Error unblocking user:', error);
    }
}

onMounted(async () => {
    const statusDoc = await apiStore.getFriendStatus(id);
    friendStatus.value = statusDoc.status;
    friendDoc.value = statusDoc.doc;
});
</script>