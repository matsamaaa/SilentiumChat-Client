<template>
    <button @click="ask" class="relative group text-green-500 hover:text-green-700 px-3 p-2 rounded-full hover:bg-green-50 transition">
        <FontAwesomeIcon icon="user-plus" />
        
        <span class="
            hidden group-hover:block 
            absolute top-full left-1/2 
            transform -translate-x-1/2 mt-2 
            px-3 py-1 
            bg-gray-800 text-white text-xs font-semibold 
            rounded-md whitespace-nowrap 
            shadow-lg 
            z-10
        ">
            Add Friend
        </span>
    </button>
</template>

<script setup>
import { useUserStore } from '#imports';
import { useApiStore } from '#imports';

const props = defineProps({
    userId: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: false,
        default: 'Unknown'
    }
});

const userStore = useUserStore();
const apiStore = useApiStore();

const ask = async () => {
    await apiStore.sendFriendRequest(props.userId);
    const user = userStore.createFriendObject(props.userId, props.username);
    return userStore.addFriend(user, 'pending', true);
}
</script>