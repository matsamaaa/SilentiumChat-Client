<template>
    <div class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 h-screen !mt-0">
        <div class="bg-gray-800 rounded-lg shadow-2xl w-[95vw] h-[90vh] max-w-2xl transform transition-all duration-300 scale-100 opacity-100 flex flex-col overflow-hidden">
            <!-- Header -->
            <div class="flex items-center justify-between border-b border-gray-700 px-6 py-4">
                <h3 class="text-xl font-bold text-gray-100">Server Invite</h3>

                <button @click="close" class="text-gray-500 hover:text-gray-400 transition duration-150 p-1 rounded-full">
                    <FontAwesomeIcon icon="fa-xmark" class="text-xl" />
                </button>
            </div>

            <div class="flex-1 overflow-y-auto px-4 py-4 divide-y divide-gray-700">
                <div
                    v-for="user in users"
                    :key="user.id"
                    class="flex items-center justify-between py-3 first:pt-0"
                >
                    <LittleProfilePlate
                        :userId="String(user.userId)"
                        :username="getMemberUser(user.userId)?.username || 'Unknown User'"
                        :avatarIconSrc="getMemberUser(user.userId)?.avatar || null"
                    />

                    <NormalButton
                        label="Invite"
                        icon="fa-user-plus"
                        color="green"
                        class="!py-1.5 !px-3 text-sm shrink-0"
                        @execute="inviteUser(user.userId)"
                    />
                </div>

                <div v-if="!users || users.length === 0" class="flex flex-col items-center justify-center text-center py-12 text-gray-500">
                    <FontAwesomeIcon icon="fa-user-group" class="text-3xl mb-3 opacity-50" />
                    <p class="text-sm">Aucun ami à inviter pour le moment</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import LittleProfilePlate from '~/components/ui/LittleProfilePlate.vue';
import { useUserStore, useStatusStore, useServersStore, useApiStore } from '#imports';
import NormalButton from '~/components/ui/buttons/NormalButton.vue';
import { encryptExistingKeyForRecipient } from '~/utils/keys/keyPairFactory.js';

const userStore = useUserStore();
const statusStore = useStatusStore();
const apiStore = useApiStore();
const serversStore = useServersStore();

const route = useRoute();
const code = route.params.code;

const emit = defineEmits(['close']);

const getMemberUser = (memberId) => {
    return statusStore.getUserById(memberId);
};

const users = computed(() => {
    return userStore.friends.accepted;
});

const close = () => {
    emit('close');
};

const inviteUser = async (userId) => {
    try {
        // get the public key of the user to invite
        const userPublicKey = await apiStore.getUserPublicKey(userId);
        if (!userPublicKey) {
            throw new Error('User public key not found');
        }

        // get server privatekey
        const serverPrivateKey = await serversStore.getServerPrivateKey(code);
        const encryptedPayload = await encryptExistingKeyForRecipient(serverPrivateKey, userPublicKey);
        console.log("Encrypted Payload:", encryptedPayload);
        await useApiStore().createInvitation(code, userId, encryptedPayload);
    } catch (error) {
        console.error("Error inviting user:", error);
        // Optionally, you can show an error notification here
    }
};

onMounted(() => {
    const statusStore = useStatusStore();
    users.value.forEach(user => {
        statusStore.initializeStatus(user.userId);
    });
});
</script>