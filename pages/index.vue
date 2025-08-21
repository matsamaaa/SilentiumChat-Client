<template>
    <div class="chat-window flex flex-col h-full">
        <div class="messages flex-1 overflow-y-auto p-2">
            <div v-for="(msg, index) in messages" :key="index">
                {{ msg }}
            </div>
        </div>
        <MessageInput @send="handleSend" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import MessageInput from '@/components/messages/MessageInput.vue'

const messages = ref([])

const handleSend = (msg) => {
    messages.value.push(msg)
}
</script>
