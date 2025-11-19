<template>
    <button @click="ask" class="text-green-500 hover:text-green-700 px-3 p-2 rounded-full hover:bg-green-50 transition">
        <FontAwesomeIcon icon="user-plus" />
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

const ask = async () => {
    await apiStore.sendFriendRequest(props.userId);
    return userStore.addFriend(props.userId, 'pending', true);
}
</script>