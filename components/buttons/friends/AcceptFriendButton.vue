<template>
    <button @click="accept" class="relative group text-green-500 hover:text-green-700 px-3 p-2 rounded-full hover:bg-green-50 transition">
        <FontAwesomeIcon icon="user-check" />
        
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
            Accept
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
    }
});

const userStore = useUserStore();
const apiStore = useApiStore();

const accept = async () => {
    await apiStore.acceptFriendRequest(props.userId);
    const user = userStore.getFriendStatus(props.userId);
    userStore.removeFriend(props.userId);
    const userObject = userStore.createFriendObject(props.userId, user.username, false);
    return userStore.addFriend(userObject, 'accepted', false);
}
</script>