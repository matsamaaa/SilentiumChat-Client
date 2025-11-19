<template>
    <div>
        <button 
            v-if="props.friendDoc?.isBlocked"
            @click="!props.friendDoc.isBlocked.includes(id) ? blockUser() : unblockUser()"
        >
            <FontAwesomeIcon :icon="['fas', 'ban']" />
        </button>
        <button
            v-if="props.friendStatus === 'rejected' || !props.friendStatus"
            @click="addFriend"
            class="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-xl hover:bg-blue-500 transition duration-150"
        >
            Add Friend 
            <FontAwesomeIcon :icon="['fa', 'user-plus']" />
        </button>
        <button
            v-else-if="props.friendStatus === 'pending' && props.friendDoc?.userId === userStore.user.uniqueId"
            @click="cancelRequest"
            class="mt-4 px-4 py-2 bg-gray-400 text-white font-semibold rounded-lg shadow-xl"
        >
            Friend Request Sent
            <FontAwesomeIcon :icon="['fa', 'clock']" />
        </button>
        <div 
            v-else-if="props.friendStatus === 'pending' && props.friendDoc?.userId != userStore.user.uniqueId"
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
            v-else-if="props.friendStatus === 'accepted'"
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
    userId: {
        type: String,
        required: true
    },
    friendStatus: {
        type: String,
        required: true
    },
    friendDoc: {
        type: Object,
        required: true
    },
})

const apiStore = useApiStore();
const userStore = useUserStore();

const friendStatus = computed(() => userStore.getFriendStatus(props.userId));

const route = useRoute();
const id = route.params.id;
const emit = defineEmits(['updateStatus', 'updateDoc']);

const addFriend = async () => {
    try {
        await apiStore.sendFriendRequest(id);
        emit('updateStatus', 'pending');
        emit('updateDoc', { ...props.friendDoc, userId: userStore.user.uniqueId, status: 'pending' });
    } catch (error) {
        console.error('Error sending friend request:', error);
    }
}

const acceptFriendRequest = async () => {
    try {
        await apiStore.acceptFriendRequest(id);
        emit('updateStatus', 'accepted');
    } catch (error) {
        console.error('Error accepting friend request:', error);
    }
}

const refuseFriendRequest = async () => {
    try {
        await apiStore.refuseFriendRequest(id);
        emit('updateStatus', 'rejected');
    } catch (error) {
        console.error('Error refusing friend request:', error);
    }
}

const blockUser = async () => {
    try {
        await apiStore.blockUser(id);
        emit('updateStatus', 'blocked');
        emit('updateDoc', { ...props.friendDoc, isBlocked: [...(props.friendDoc?.isBlocked || []), id] });
    } catch (error) {
        console.error('Error blocking user:', error);
    }
}

const cancelRequest = async () => {
    try {
        await apiStore.cancelFriendRequest(id);
        emit('updateStatus', 'rejected');
        emit('updateDoc', { ...props.friendDoc, status: 'rejected' });
    } catch (error) {
        console.error('Error cancelling friend request:', error);
    }
}

const unblockUser = async () => {
    try {
        await apiStore.unblockUser(id);
        emit('updateStatus', 'rejected');
        emit('updateDoc', { ...props.friendDoc, isBlocked: props.friendDoc?.isBlocked.filter(uid => uid !== id), status: 'rejected' });
    } catch (error) {
        console.error('Error unblocking user:', error);
    }
}
</script>