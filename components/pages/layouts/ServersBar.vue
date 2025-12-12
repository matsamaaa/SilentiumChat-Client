<template>
    <div class="w-[5vw] h-[94vh] bg-gray-900 flex flex-col items-center py-4 border-r border-gray-800">
        <button
            @click="navigationStore.goToHome"
            class="bg-gray-800 flex flex-col justify-center items-start p-4 rounded-lg hover:bg-gray-700 duration-200">
            <FontAwesomeIcon icon="fa-solid fa-message" class="text-indigo-600 hover:text-indigo-500 text-2xl duration-200"/>
        </button>
    </div>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useNavigationStore } from '@/stores/navigation';

const navigationStore = useNavigationStore();
</script>