<template>
    <div class="flex flex-col rounded-t-lg shadow-md">
        <div v-if="file" class="p-2 flex flex-col h-[200px] justify-between items-center w-[150px] max-w-xs bg-gray-800 ml-2 rounded-lg">
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

        <div class="flex items-center p-3 gap-3 h-[7vh]">
            <FilesButton 
                v-if="!isBlocked"
                ref="uploaderRef" 
                @file-selected="handleFile" 
            /> 
            
            <input
                v-model="message"
                @keyup.enter="sendMessage"
                type="text"
                :placeholder="inputPlaceholder" class="flex-1 transition duration-150 ease-in-out"
                :disabled="isBlocked" 
                :class="{
                    'bg-gray-700 text-gray-500 placeholder-red-400 cursor-not-allowed': isBlocked, 
                    'bg-gray-800 text-white': !isBlocked
                }"
            />

            <button 
                type="submit" 
                @click="sendMessage"
                :disabled="isBlocked"
                :class="{
                    'bg-red-900 text-gray-500 opacity-60 cursor-not-allowed': isBlocked,
                    'bg-indigo-600 hover:bg-indigo-500 text-white': !isBlocked 
                }"
                class="px-4 py-2 rounded-lg font-semibold transition duration-150 ease-in-out"
            >
                Envoyer
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import FilesButton from './FilesButton.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useUserStore } from '#imports';
import { useRoute } from 'vue-router'

const message = ref('')
const file = ref(null)
const preview = ref(null)
const uploaderRef = ref(null)

const userStore = useUserStore();
const route = useRoute();
const id = route.params.id;
const emit = defineEmits(['send'])

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

const friendStatus = userStore.getFriendStatus(id);
const isBlocked = computed(() => friendStatus?.status === 'blocked')

const inputPlaceholder = computed(() => {
    return isBlocked.value ? "You can't send messages to this user." : "Type your message..."
})
</script>
