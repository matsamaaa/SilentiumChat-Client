<template>
    <button @click="refuse" class="relative group text-red-500 hover:text-red-700 px-3 p-2 rounded-full hover:bg-green-50 transition">
        <FontAwesomeIcon icon="user-xmark" />
        
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
            Refuse
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

const refuse = async () => {
    await apiStore.refuseFriendRequest(props.userId);
    return userStore.removeFriend(props.userId);
}
</script>