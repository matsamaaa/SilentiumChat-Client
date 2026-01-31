<template>
    <div>

        <h3 class="text-xl font-semibold text-gray-100 border-b border-gray-700 pb-2">Import Private Key</h3>
        <p class="text-gray-500 text-sm gap py-2">Import your private key here.</p>

        <div class="flex items-center space-x-6">
            <div class="text-4xl font-bold rounded-full w-24 h-24 flex items-center justify-center bg-indigo-500 text-white border-4 border-indigo-400 overflow-hidden">
                <AvatarIcon 
                    :userId="userStore.user.uniqueId"
                    :username="userStore.user.username"
                    :isBanner="false"
                    :src="previewLocal"
                    class="scale-150"
                />
            </div>

            <div class="flex flex-col space-y-2">
                <ChangeAvatarButton @avatar-selected="handleAvatar" />
                <AlertButton text="Remove Avatar" @execute="deleteAvatar" />
            </div>
        </div>

    </div>
</template>

<script setup>
import AvatarIcon from '~/components/ui/icons/AvatarIcon.vue';

import { useUserStore, useApiStore } from '#imports';
import ChangeAvatarButton from '~/components/buttons/ChangeAvatarButton.vue';
import AlertButton from '~/components/ui/buttons/AlertButton.vue';

const userStore = useUserStore();
const apiStore = useApiStore();

const props = defineProps({
    preview: {
        type: String,
        default: null
    },
    file: {
        type: Object,
        default: null
    }
});

const emit = defineEmits(['update:preview', 'update:file']);

const previewLocal = ref(props.preview);
watch(
    () => props.preview,
    (value) => {
        previewLocal.value = value;
    }
);

const fileLocal = ref(props.file);
watch(
    () => props.file,
    (value) => {
        fileLocal.value = value;
    }
);

const setPreview = (value) => {
    previewLocal.value = value;
    emit('update:preview', value);
};

const setFile = (value) => {
    fileLocal.value = value;
    emit('update:file', value);
};

const deleteAvatar = async () => {
    try {
        await apiStore.deleteAvatar();
    } catch (error) {
        console.error('Error deleting avatar:', error);
    }

    setPreview(null);
    setFile(null);
};

const handleAvatar = async ({ file: uploadedFile, preview: pre }) => {
    try {
        setPreview(pre);
        setFile(uploadedFile);
    } catch (err) {
        console.error("Upload failed:", err);
    }
}
</script>