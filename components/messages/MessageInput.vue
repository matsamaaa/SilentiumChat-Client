<template>
    <div class="flex flex-col rounded-t-lg shadow-md">
        <!-- Zone preview -->
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

        <!-- Zone d'écriture -->
        <div class="flex items-center p-3 gap-3 h-[7vh] bg-gray-900">
            <FilesButton ref="uploaderRef" @file-selected="handleFile" />
            
            <input
                v-model="message"
                @keyup.enter="sendMessage"
                type="text"
                placeholder="Écrire un message..."
                class="flex-1"
            />

            <button type="submit" @click="sendMessage">
                Envoyer
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import FilesButton from './FilesButton.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const message = ref('')
const file = ref(null)
const preview = ref(null)
const uploaderRef = ref(null)

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
</script>
