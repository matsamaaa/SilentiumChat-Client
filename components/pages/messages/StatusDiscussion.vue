<template>
    <button 
        @click="updateDiscussion(user, status)"
        :class="{
            'bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-1 px-2 rounded': status === 'accepted',
            'bg-gray-500 hover:bg-gray-400 text-white font-bold py-1 px-2 rounded': status === 'refused'
        }"
        class="w-[200px] py-3 max-h-fit duration-200"
    >
        {{ status === 'accepted' ? 'Accept' : 'Decline' }} Discussion
    </button>
</template>

<script setup>
import { useApiStore } from '@/stores/api'
import { usePrivateDiscussionsStore } from '@/stores/privateDiscussions'
const props = defineProps({
    user: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        validator: value => ['accepted', 'refused'].includes(value)
    }
})

const apiStore = useApiStore();
const privateDiscussionsStore = usePrivateDiscussionsStore(); 
const emit = defineEmits(['updated']);

const updateDiscussion = async (user, status) => {
    await apiStore.updateDiscussionStatus(user, status);
    await privateDiscussionsStore.updateStatusDiscussion(user, status);

    emit('updated');
}
</script>
