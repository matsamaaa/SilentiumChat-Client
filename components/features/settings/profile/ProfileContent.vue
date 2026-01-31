<template>
    <div class="h-full">
        <section class="bg-gray-800 p-6 rounded-xl shadow-xl space-y-8">
        
            <div>
                <h2 class="text-xl font-semibold text-gray-100 mb-4 border-b border-gray-700 pb-2">Profile Settings</h2>
                <p class="text-sm text-gray-500">Manage your profile information and preferences.</p>
            </div>

            <UpdateProfilePictureContent 
                v-model:preview="preview" 
                v-model:file="file"
                />

            <hr class="border-gray-700">

            <UpdateUsernameContent 
                v-model:username="username"
                v-model:tag="tag"
                />

        </section>

        <div class="mt-8 pt-4 flex flex-row justify-end items-center space-x-4">
            <p v-if="hasChanges" class="text-red-500 font-medium italic">You have unsaved changes.</p>
            <AlertButton
                v-if="hasChanges"
                text="Cancel"
                @execute="CancelSave"
                />
            <ConfirmButton 
                v-if="hasChanges"
                text="Save Changes"
                @saved="handleSave" 
                />
        </div>
    </div>
</template>

<script setup>
import UpdateProfilePictureContent from '~/components/features/settings/profile/UpdateProfilePictureContent.vue';
import UpdateUsernameContent from '~/components/features/settings/profile/UpdateUsernameContent.vue';
import ConfirmButton from '~/components/ui/buttons/ConfirmButton.vue';

import { useUserStore, useApiStore } from '#imports';
import AlertButton from '~/components/ui/buttons/AlertButton.vue';

const userStore = useUserStore();
const apiStore = useApiStore();

const username = ref(userStore.user.username || '');
const tag = ref(userStore.user.tag.toString().padStart(4, '0') || '');
const preview = ref(userStore.avatar || null);
const file = ref(null);

const hasChanges = computed(() => {
    return (
        username.value !== userStore.user.username ||
        tag.value !== userStore.user.tag.toString().padStart(4, '0') ||
        preview.value !== null && preview.value !== userStore.avatar
    );
});

const handleSave = async () => {
    try {
        if (username.value !== userStore.user.username) {
            await apiStore.updateUsername(username.value);
        }
        if (tag.value !== userStore.user.tag.toString().padStart(4, '0')) {
            await apiStore.updateTag(tag.value);
        }
        if (preview.value) {
            await apiStore.uploadAvatar(file.value);
            await apiStore.getAvatar();
            preview.value = userStore.avatar;
        }
    } catch (error) {
        console.error('Error saving profile changes:', error);
    }
};

const CancelSave = () => {
    username.value = userStore.user.username || '';
    tag.value = userStore.user.tag.toString().padStart(4, '0') || '';
    preview.value = userStore.avatar || null;
    file.value = null;
};
</script>