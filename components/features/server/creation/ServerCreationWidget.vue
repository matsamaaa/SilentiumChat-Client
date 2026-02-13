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

const icon = ref(null);
const name = ref('');
const banner = ref(null);

const createServer = () => {
    // Logique de création du serveur
    console.log('Creating server with:', { name: name.value, icon: icon.value, banner: banner.value });
}
</script>