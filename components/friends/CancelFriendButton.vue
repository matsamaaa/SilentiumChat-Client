<template>
    <button @click="cancel" class="text-orange-500 hover:text-orange-700 px-3 p-2 rounded-full hover:bg-green-50 transition">
        <FontAwesomeIcon icon="user-clock" />
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

const cancel = async () => {
    await apiStore.cancelFriendRequest(props.userId);
    return userStore.removeFriend(props.userId);
}
</script>