<template>
    <button @click="remove" class="text-red-500 hover:text-red-700 px-3 p-2 rounded-full hover:bg-green-50 transition">
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

const remove = async () => {
    await apiStore.removeFriend(props.userId);
    return userStore.removeFriend(props.userId);
}
</script>