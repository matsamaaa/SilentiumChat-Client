<template>
    <div class="flex flex-row justify-center gap-3 mb-2">
        <AlertButton
            text="Decline"
            @saved="updateDiscussion(userId, 'refused')"
            />
        <ConfirmButton
            text="Accept"
            @saved="updateDiscussion(userId, 'accepted')"
            />
    </div>
</template>

<script setup>
import AlertButton from '~/components/ui/buttons/AlertButton.vue';
import ConfirmButton from '~/components/ui/buttons/ConfirmButton.vue';

import { usePrivateDiscussionsStore, useApiStore, useUserStore } from '#imports';

const apiStore = useApiStore();
const privateDiscussionsStore = usePrivateDiscussionsStore(); 
const userStore = useUserStore();

const props = defineProps({
    userId: {
        type: String,
        required: true
    },
})

const emit = defineEmits(['updated']);

const updateDiscussion = async (userId, status) => {
    await apiStore.updateDiscussionStatus(userId, status);
    await privateDiscussionsStore.updateStatusDiscussion(userId, userStore.user.uniqueId, status);

    emit('updated');
}
</script>
