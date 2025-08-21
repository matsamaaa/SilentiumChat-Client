<template>
    <div class="flex items-center p-3 bg-gray-900 rounded-t-lg shadow-md">
        <!-- Input -->
        <input
            v-model="message"
            @keyup.enter="sendMessage"
            type="text"
            placeholder="Écrire un message..."
            class="flex-1 bg-gray-800 text-white placeholder-gray-400 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        <!-- Bouton Envoyer -->
        <button
            @click="sendMessage"
            class="ml-3 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-full shadow-md transition"
        >
            Envoyer
        </button>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const message = ref('')
const emit = defineEmits(['send'])

const sendMessage = () => {
    if (!message.value.trim()) return
    emit('send', message.value)
    message.value = ''
}
</script>
