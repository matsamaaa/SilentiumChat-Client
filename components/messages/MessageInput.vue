<template>
    <div class="flex flex-col bg-gray-900 rounded-t-lg shadow-md">
        <!-- Zone preview -->
        <div v-if="preview" class="p-3 flex justify-center">
            <img :src="preview" alt="Aperçu" class="max-h-40 rounded-lg shadow" />
        </div>

        <!-- Zone d'écriture -->
        <div class="flex items-center p-3 gap-3 h-[7vh]">
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

const message = ref('')
const file = ref(null)
const preview = ref(null)
const uploaderRef = ref(null)

const emit = defineEmits(['send'])

const handleFile = ({ file: selectedFile, preview: selectedPreview }) => {
    file.value = selectedFile
    preview.value = selectedPreview
}

const sendMessage = () => {
    if (!message.value.trim()) return
    emit('send', { message: message.value, file: file.value })
    message.value = ''
    file.value = null
    preview.value = null
    uploaderRef.value.clearPreview()
}
</script>
