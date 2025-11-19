<template>
<div class="flex flex-col rounded-t-lg shadow-md">
        <div v-if="file" class="p-2 flex flex-col h-[200px] justify-between items-center w-[150px] max-w-xs bg-gray-800 ml-2 rounded-lg">
            <button 
                @click="clearFile"
                class="top-1 right-1 text-gray-400 hover:text-red-500"
            >
                <FontAwesomeIcon :icon="['fas', 'xmark']" />
            </button>

            <img v-if="preview" :src="preview" alt="Aperçu" class="w-[130px] h-[130px] rounded-lg shadow bg-cover" />
            <FontAwesomeIcon v-else :icon="['fas', 'file']" class="text-5xl text-gray-400" />
            <p class="truncate max-w-[130px] ml-2">{{ file.name }}</p>
        </div>

        <div class="flex items-center p-3 gap-3 h-[7vh] bg-gray-900">
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
                    // 2. Custom style when blocked: darker background, disabled cursor, red text
                    'bg-gray-700 text-gray-500 placeholder-red-400 cursor-not-allowed': isBlocked, 
                    // Default style when active:
                    'bg-gray-800 text-white': !isBlocked
                }"
            />

            <button 
                type="submit" 
                @click="sendMessage"
                :disabled="isBlocked"
                :class="{
                    // Blocked style: darker background, less opacity, disabled cursor
                    'bg-red-900 text-gray-400 opacity-60 cursor-not-allowed': isBlocked,
                    // Default style (assuming a blue/primary color for active)
                    'bg-blue-600 hover:bg-blue-700 text-white': !isBlocked 
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
import { useApiStore } from '#imports';
import { useRoute } from 'vue-router'

const props = defineProps({
    friendStatus: {
        type: String,
        required: true
    },
    friendDoc: {
        type: Object,
        required: true
    },
})

const message = ref('')
const file = ref(null)
const preview = ref(null)
const uploaderRef = ref(null)

const apiStore = useApiStore();
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

const isBlocked = computed(() => props.friendStatus === 'blocked')

const inputPlaceholder = computed(() => {
    return isBlocked.value && props.friendDoc ? (props.friendDoc.userId === id ? "You can't send message to this user." : "You have blocked this user.") : "Envoyer un message..."
})
</script>
