<template>
    <button @click="block" class="relative group text-gray-500 hover:text-gray-400 px-3 p-2 rounded-full hover:bg-green-50 transition">
        <FontAwesomeIcon icon="user-lock" />
        
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
            Block
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

const block = async () => {
    await apiStore.blockUser(props.userId);
    const user = userStore.getFriendStatus(props.userId) || userStore.createFriendObject(props.userId, props.username);
    userStore.removeFriend(props.userId);
    return userStore.addFriend(user, 'blocked', true);
}
</script>