<template>
    <div class="w-[18vw] h-[6vh] bg-gray-900 absolute bottom-0 left-0 border-t border-r rounded-r-lg border-gray-700 flex items-center justify-between p-2 flex-row">
        <div class="flex flex-row justify-start items-center">
            <AvatarIcon />
            <div class="flex flex-col">
                <p class="pl-4 text-indigo-600 text-lg">{{ username }}</p>
                <p class="pl-4 text-gray-500 text-sm">#{{ tag }}</p>
            </div>
        </div>
        <FontAwesomeIcon
            @click="navigationStore.goToSettings"
            icon="fa-solid fa-gear" 
            class="pl-4 text-gray-500 text-sm cursor-pointer" />
    </div>
</template>

<script setup>
import AvatarIcon from '~/components/users/AvatarIcon.vue';
import { useUserStore } from '@/stores/user';
import { useNavigationStore } from '@/stores/navigation';

const userStore = useUserStore();
const navigationStore = useNavigationStore();

const username = ref(userStore.user.username || 'unknown');
const tag = ref(userStore.user.tag.toString().padStart(4, '0') || '');
</script>