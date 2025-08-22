<template>
    <div class="flex flex-col h-full static">
        <div class="flex-1 overflow-y-auto p-2">
            <div v-for="(msg, index) in messages" :key="index">
                {{ msg }}
            </div>
        </div>
        <MessageInput @send="handleSend" class="absolute bottom-0 left-0 right-0" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import MessageInput from '@/components/messages/MessageInput.vue'
import { useWebSocketStore } from '@/stores/ws'

const messages = ref([])
const webSocketStore = useWebSocketStore()

const handleSend = (msg) => {
    messages.value.push(msg)
    webSocketStore.wsSendMessage("00000000000000000002", msg) // TODO: remplacer par le destinataire réel
}
</script>