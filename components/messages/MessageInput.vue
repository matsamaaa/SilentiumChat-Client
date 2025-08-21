<template>
    <div class="message-input flex items-center p-2 bg-gray-800 rounded">
        <input
            v-model="message"
            @keyup.enter="sendMessage"
            type="text"
            placeholder="Écrire un message..."
            class="flex-1 p-2 rounded bg-gray-700 text-white focus:outline-none"
        />
        <button
            @click="sendMessage"
            class="ml-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded"
        >
            Envoyer
        </button>
    </div>
</template>


<script setup>
import { ref, defineEmits } from 'vue'

const message = ref('');
const emit = defineEmits(['send']);

const sendMessage = () => {
    if (message.value.trim() === '') return;
    emit('send', message.value);
    message.value = '';
}
</script>

<style scoped>
.message-input input::placeholder {
    color: #cbd5e0;
}
</style>