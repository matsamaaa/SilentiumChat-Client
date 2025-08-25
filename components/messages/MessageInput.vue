<template>
    <div class="flex items-center p-3 gap-3 bg-gray-900 rounded-t-lg shadow-md">
        <FilesButton @file-selected="handleFile" />
        <!-- Input -->
        <input
            v-model="message"
            @keyup.enter="sendMessage"
            type="text"
            placeholder="Écrire un message..."
            class="flex-1"
        />

        <!-- Bouton Envoyer -->
        <button
            type="submit"
            @click="sendMessage"
        >
            Envoyer
        </button>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import FilesButton from './FilesButton.vue'

const message = ref('')
const file = ref(null)

const emit = defineEmits(['send'])

const handleFile = (selectedFile) => {
    file.value = selectedFile
}

const sendMessage = () => {
    if (!message.value.trim()) return
    emit('send', { message: message.value, file: file.value })
    message.value = ''
}
</script>
