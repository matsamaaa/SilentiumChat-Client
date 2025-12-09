<template>
    <button @click="navigationStore.goToMessaging(props.userId)" class="relative group text-indigo-600 hover:text-indigo-500 px-3 p-2 rounded-full hover:bg-white transition">
        <FontAwesomeIcon icon="fa-solid fa-comment" />
        
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
            Message Friend
        </span>
    </button>
</template>

<script setup>
import { useNavigationStore } from '#imports';

const props = defineProps({
    userId: {
        type: String,
        required: true
    }
});

const navigationStore = useNavigationStore();
</script>