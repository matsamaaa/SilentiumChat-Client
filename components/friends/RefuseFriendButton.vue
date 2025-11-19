<template>
    <button @click="refuse" class="text-green-500 hover:text-green-700 px-3 p-2 rounded-full hover:bg-green-50 transition">
        <FontAwesomeIcon icon="user-xmark" />
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