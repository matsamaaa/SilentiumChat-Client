<template>
    <div class="flex flex-col items-center w-full h-full">
        <UploadBannerContent @update:banner="(newBanner) => banner = newBanner" />
        <div class="flex flex-col items-center justify-center flex-1 w-full">
            <div class="flex flex-row items-center gap-3">
                <UploadIconContent @update:icon="(newIcon) => icon = newIcon" />
                <NormalInput v-model="name" placeholder="Server Name" class="w-64" />
            </div>
            <br />  
            <NormalButton label="Create Server" icon="fa-server" @click="createServer">Create</NormalButton>
        </div>
    </div>
</template>

<script setup>
import NormalInput from '~/components/ui/inputs/NormalInput.vue';
import UploadIconContent from './UploadIconContent.vue';
import UploadBannerContent from './UploadBannerContent.vue';
import NormalButton from '~/components/ui/buttons/NormalButton.vue';

import { useApiStore, useUserStore } from '#imports';

const icon = ref(null);
const name = ref('');
const banner = ref(null);

const createServer = async () => {
    const apiStore = useApiStore();
    const userStore = useUserStore();

    try {
        const server = await apiStore.createServer(name.value, userStore.user.uniqueId);
        console.log('Server created:', server);
        console.log(banner.value);
        if (banner.value) {
            await apiStore.uploadServerBanner(server.code, banner.value.file);
        }
        if (icon.value) {
            await apiStore.uploadServerIcon(server.code, icon.value.file);
        }
    } catch (error) {
        console.error('Error creating server:', error);
    }
}
</script>