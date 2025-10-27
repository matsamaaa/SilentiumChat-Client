<template>
    <div>
        <section class="bg-gray-800 p-6 rounded-xl shadow-xl space-y-8">
        
            <div>
                <h2 class="text-xl font-semibold text-gray-100 mb-4 border-b border-gray-700 pb-2">Profile Picture</h2>
                
                <div class="flex items-center space-x-6">
                    <div class="text-4xl font-bold rounded-full w-24 h-24 flex items-center justify-center bg-indigo-500 text-white border-4 border-indigo-400 overflow-hidden">
                        <div v-if="preview" class="w-full h-full">
                            <img 
                                :src="preview" 
                                alt="Avatar preview" 
                                class="w-full h-full object-cover"
                            >
                        </div>
                        <div v-else-if="userStore.avatar" class="w-full h-full">
                            <img 
                                :src="userStore.avatar" 
                                alt="Avatar" 
                                class="w-full h-full object-cover"
                            >
                        </div>
                        <div v-else>
                            {{ String(userStore.user.username).toUpperCase().trim().split('')[0] }}
                        </div>

                    </div>
                
                    <div class="flex flex-col space-y-2">
                        <AvatarUpload @avatar-selected="handleAvatar" />
                        <button @click="deleteAvatar" class="px-4 py-2 bg-gray-700 text-red-400 border border-red-600 rounded-lg hover:bg-gray-600 transition duration-150">
                            Delete
                        </button>
                    </div>
                </div>
            </div>

            <hr class="border-gray-700">

            <div>
                <h2 class="text-xl font-semibold text-gray-100 mb-4 border-b border-gray-700 pb-2">Username</h2>
                
                <div class="space-y-4">
                    <label for="username" class="block text-sm font-medium text-gray-300">New Username and Tag</label>

                    <div class="flex items-center w-full sm:w-96 border border-gray-600 bg-gray-900 rounded-md shadow-sm focus-within:ring-indigo-500 focus-within:border-indigo-500 focus-within:ring-1">
                        
                        <input 
                            type="text" 
                            id="username" 
                            v-model="username"
                            placeholder="Entrez votre nouveau nom d'utilisateur"
                            class="block flex-1 px-3 py-2 bg-gray-900 text-white focus:outline-none sm:text-sm rounded-l-md rounded-r-none"
                        >
                        <span class="text-gray-400 px-2">#</span>

                        <input 
                            v-model="tag" 
                            type="text" 
                            placeholder="0000" 
                            maxlength="5"
                            @input="formatTag"
                            required 
                            class="w-16 px-2 py-2 text-center bg-gray-700 text-gray-300 font-mono focus:outline-none sm:text-sm rounded-l-none rounded-r-md"
                        />
                    </div>
                    <p class="text-xs text-gray-400">
                        Your username is visible to all other users. The Tag is a unique four-digit identifier.
                    </p>
                </div>
            </div>
        
        </section>

        <SaveButton :updates="hasChanges" @saved="handleSave" />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { useApiStore } from '@/stores/api';
import AvatarUpload from '../others/ChangeAvatarButton.vue';
import SaveButton from '../others/saveButton.vue';

const apiStore = useApiStore();
const userStore = useUserStore();

const tag = ref(userStore.user.tag.toString().padStart(4, '0') || '');
const username = ref(userStore.user.username || '');
const preview = ref(null);
const file = ref(null);

const formatTag = () => {
    tag.value = tag.value.replace(/\D/g, "");

    if (tag.value.split('').length > 4) {
        tag.value = tag.value.slice(-4);
    }
}

const hasChanges = computed(() => {
    return (
        username.value !== userStore.user.username ||
        tag.value !== userStore.user.tag.toString().padStart(4, '0') ||
        preview.value !== null
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
            preview.value = null;
            await apiStore.getAvatar();
        }
    } catch (error) {

    }
};

const deleteAvatar = async () => {
    await apiStore.deleteAvatar();
    userStore.avatar = null;
    preview.value = null;
    file.value = null;
}

async function handleAvatar({ file: uploadedFile, preview: pre }) {
    try {
        preview.value = pre;
        file.value = uploadedFile;
    } catch (err) {
        console.error("Upload failed:", err);
    }
}
</script>