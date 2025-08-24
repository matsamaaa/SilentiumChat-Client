<template>
    <div class="flex items-center p-3 gap-3 bg-gray-900 rounded-t-lg shadow-md">
        <FilesButton />
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
const emit = defineEmits(['send'])

const sendMessage = () => {
    if (!message.value.trim()) return
    emit('send', message.value)
    message.value = ''
}
</script>
