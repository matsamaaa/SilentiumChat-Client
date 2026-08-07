<template>
    <div class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 h-screen !mt-0">
        <div class="bg-gray-800 rounded-lg shadow-2xl w-[95vw] h-[90vh] max-w-2xl transform transition-all duration-300 scale-100 opacity-100 flex flex-col overflow-hidden">
            <div class="flex items-center justify-between border-b border-gray-700 px-6 py-4">
                <h3 class="text-xl font-bold text-gray-100">Server Settings</h3>

                <button @click="close" class="text-gray-500 hover:text-gray-400 transition duration-150 p-1 rounded-full">
                    <FontAwesomeIcon icon="fa-xmark" class="text-xl" />
                </button>
            </div>

            <div v-if="loading" class="flex-1 flex items-center justify-center">
                <FontAwesomeIcon icon="fa-solid fa-spinner" class="text-gray-400 text-2xl animate-spin" />
            </div>

            <div v-else class="flex-1 overflow-y-auto px-6 py-6 space-y-8">
                <section>
                    <h4 class="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">
                        Banner
                    </h4>
                    <div class="bg-gray-900/40 rounded-lg p-4 border border-gray-700">
                        <UploadBannerContent
                            ref="bannerContent"
                            :initial-preview="server?.banner"
                            @update:banner="(newBanner) => banner = newBanner"
                        />
                    </div>
                </section>

                <section>
                    <h4 class="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">
                        Server Identity
                    </h4>
                    <div class="bg-gray-900/40 rounded-lg p-4 border border-gray-700 flex flex-col sm:flex-row items-center gap-5">
                        <UploadIconContent
                            ref="iconContent"
                            :initial-preview="server?.icon"
                            @update:icon="(newIcon) => icon = newIcon"
                        />

                        <div class="flex-1 w-full">
                            <label class="block text-xs text-gray-400 mb-1.5">
                                Server Name
                            </label>
                            <NormalInput v-model="name" placeholder="Server Name" class="w-full" />
                        </div>
                    </div>
                </section>

                <section v-if="server">
                    <h4 class="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">
                        Informations
                    </h4>
                    <div class="bg-gray-900/40 rounded-lg p-4 border border-gray-700 grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p class="text-gray-500 text-xs mb-1">Server Code</p>
                            <p class="text-gray-200 font-mono">{{ code }}</p>
                        </div>
                        <div v-if="server?.createdAt">
                            <p class="text-gray-500 text-xs mb-1">Created on</p>
                            <p class="text-gray-200">{{ new Date(server.createdAt).toLocaleDateString() }}</p>
                        </div>
                    </div>
                </section>
                <AlertButton text="Delete Server" @execute="showDeleteServerWarnPopup = true" />
                <WarnPopup
                    v-if="showDeleteServerWarnPopup"
                    :message="'Are you sure you want to delete this server? This action cannot be undone.'"
                    @close="showDeleteServerWarnPopup = false"
                    @confirm="deleteServer"
                />
            </div>

            <div v-if="!loading" class="flex items-center justify-end gap-3 border-t border-gray-700 px-6 py-4">
                <button
                    @click="close"
                    class="px-4 py-2 rounded-md text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition duration-150"
                >
                    Annuler
                </button>
                <NormalButton
                    label="Save Changes"
                    icon="fa-check"
                    :disabled="saving"
                    @click="saveServer"
                >
                    {{ saving ? 'Saving...' : 'Save Changes' }}
                </NormalButton>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import NormalInput from '~/components/ui/inputs/NormalInput.vue';
import UploadIconContent from '~/components/features/server/creation/UploadIconContent.vue';
import UploadBannerContent from '~/components/features/server/creation/UploadBannerContent.vue';
import NormalButton from '~/components/ui/buttons/NormalButton.vue';
import AlertButton from '~/components/ui/buttons/AlertButton.vue';

import { useApiStore, useServersStore } from '#imports';
import WarnPopup from '~/components/ui/popups/WarnPopup.vue';

const route = useRoute();
const code = route.params.code;

const emit = defineEmits(['close', 'updated']);

const apiStore = useApiStore();
const serversStore = useServersStore();

const server = ref(null);
const name = ref('');
const icon = ref(null);
const banner = ref(null);

const loading = ref(true);
const saving = ref(false);

const showDeleteServerWarnPopup = ref(false);

onMounted(async () => {
    try {
        server.value = await serversStore.getServerByCode(code);
        name.value = server.value?.name ?? '';
    } catch (error) {
        console.error('Error fetching server:', error);
    } finally {
        loading.value = false;
    }
});

const close = () => {
    emit('close');
};

const saveServer = async () => {
    saving.value = true;

    try {
        if (name.value && name.value !== server.value?.name) {
            await apiStore.updateServerName(code, name.value);
        }
        if (banner.value) {
            await apiStore.uploadServerBanner(code, banner.value.file);
        }
        if (icon.value) {
            await apiStore.uploadServerIcon(code, icon.value.file);
        }
    } catch {} finally {
        emit('updated');
        close();
    }
};

const deleteServer = async () => {
    try {
        await apiStore.deleteServer(code);
        serversStore.removeServer(code);
        emit('updated');
        close();
    } catch (error) {
        console.error('Error deleting server:', error);
    }
};
</script>