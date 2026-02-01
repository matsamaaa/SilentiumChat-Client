<template>
    <div class="flex flex-col rounded-t-lg shadow-md w-fill">

        <!-- Preview Of Selected File -->
        <div 
           v-if="file" 
           class="p-2 flex flex-col h-[200px] justify-between items-center w-[150px] max-w-xs bg-gray-800 ml-2 rounded-lg">

            <button 
                @click="clearFile"
                class="top-1 right-1 text-gray-500 hover:text-red-500"
            >
                <FontAwesomeIcon :icon="['fas', 'xmark']" />
            </button>

            <img v-if="preview" :src="preview" alt="Aperçu" class="w-[130px] h-[130px] rounded-lg shadow bg-cover" />
            <FontAwesomeIcon v-else :icon="['fas', 'file']" class="text-5xl text-gray-500" />
            <p class="truncate max-w-[130px] ml-2 text-white">{{ file.name }}</p>

        </div>

        <!-- Input Message -->
        <div class="flex items-center px-2 gap-3 h-[7vh] w-full">
            <UploadFileContent 
                v-if="!isBlocked"
                ref="uploaderRef"
                :id="props.id" 
                @file-selected="handleFile"
                />

            <SearchInput
                v-model="message"
                @search="sendMessage"
                placeholder="Type a message..."
                />

            <SendMessageButton 
                @send="sendMessage"
                />
        </div>

    </div>
</template>

<script setup>
import UploadFileContent from '~/components/features/messages/UploadFileContent.vue';
import SearchInput from '~/components/ui/inputs/SearchInput.vue';
import SendMessageButton from '~/components/features/messages/SendMessageButton.vue';

import { useUserStore } from '#imports';

const props = defineProps({
    inputPlaceholder: {
        type: String,
        default: 'Type a message...'
    },
    id: {
        type: String,
        required: true
    }
});

const userStore = useUserStore();

const message = ref('');
const file = ref(null);
const preview = ref(null);
const uploaderRef = ref(null)
const friendStatus = userStore.getFriendStatus(props.id);
const isBlocked = computed(() => friendStatus?.status === 'blocked');

const emit = defineEmits(['send']);

const handleFile = ({ file: selectedFile, preview: selectedPreview }) => {
    file.value = selectedFile
    preview.value = selectedPreview
}

const clearFile = () => {
    file.value = null
    preview.value = null
    uploaderRef.value.clearPreview()
}

const sendMessage = () => {
    if (!message.value.trim() && !file.value) return
    emit('send', { message: message.value, file: file.value })
    message.value = ''
    file.value = null
    preview.value = null
    uploaderRef.value.clearPreview()
}
</script>