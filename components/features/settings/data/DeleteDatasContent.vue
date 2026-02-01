<template>
    <div>

        <h3 class="text-xl font-semibold text-gray-100 border-b border-gray-700 pb-2">Delete Data</h3>
        <p class="text-gray-500 text-sm gap py-2">Delete your data permanently from our servers and from your device, this action can't be undone.</p>

        <AlertButton text="Delete All My Data" @execute="request = true" />


        <WarnPopup 
            v-if="request"
            message="Are you sure you want to delete everything?"
            @confirm="userStore.clearAllDatas()"
            @close="request = false"
            />
    </div>
</template>

<script setup>
import AlertButton from '~/components/ui/buttons/AlertButton.vue';
import WarnPopup from '~/components/ui/popups/WarnPopup.vue';

import { useUserStore } from '#imports';

const userStore = useUserStore();

const request = ref(false);
</script>