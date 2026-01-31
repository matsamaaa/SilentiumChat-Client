<template>
    <div>

        <h3 class="text-xl font-semibold text-gray-100 border-b border-gray-700 pb-2">Delete Data</h3>
        <p class="text-gray-500 text-sm gap py-2">Delete your data permanently from our servers and from your device, this action can't be undone.</p>

        <RedButton text="Delete All My Data" @execute="request = true" />


        <Warn 
            v-if="request"
            message="Are you sure you want to delete everything?"
            @confirm="userStore.clearAllDatas()"
            @close="request = false"
            />
    </div>
</template>

<script setup>
import RedButton from '~/components/buttons/RedButton.vue';
import Warn from '~/components/popups/Warn.vue';

import { useUserStore } from '#imports';

const userStore = useUserStore();

const request = ref(false);
</script>