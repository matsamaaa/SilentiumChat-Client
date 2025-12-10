<template>
    <div class="w-full">
        <button 
            class="w-full flex flex-row justify-center items-center gap-1 px-3 py-2 rounded-md text-red-500 focus:outline-none bg-gray-800"
            @click="userStore.logout"
        >
            Logout
            <FontAwesomeIcon
                icon="fa-solid fa-arrow-right-from-bracket" 
                class="text-red-500 text-sm cursor-pointer" />
        </button>
    </div>
</template>

<script setup>
import { useUserStore } from '#imports';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const userStore = useUserStore();
</script>