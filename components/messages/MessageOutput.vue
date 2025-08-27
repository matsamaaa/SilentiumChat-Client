<template>
    <div 
        :class="[
        'flex flex-col p-2 my-2 max-w-md break-words',
        isOwnMessage ? 'self-end bg-blue-500 rounded-l-lg rounded-br-lg' : 'self-start bg-gray-500 rounded-r-lg rounded-bl-lg'
        ]"
    >
        <!-- Message text -->
        <p class="whitespace-pre-wrap text-sm" :class="{'text-right': isOwnMessage}">
            {{ isOwnMessage ? msg.encryptedMessageBySender : msg.encryptedMessage }}
        </p>

        <!-- Files -->
        <div v-if="msg.files?.length" class="mt-2 space-y-2">
            <div v-for="file in msg.files" :key="file.name">
                <!-- Images -->
                <img 
                    v-if="['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(file.extension)" 
                    :src="file.url" 
                    :alt="file.name" 
                    class="max-w-xs rounded shadow" 
                />

                <!-- Videos -->
                <video
                    v-else-if="['mp4', 'mov', 'webm', 'ogg'].includes(file.extension)"
                    :src="file.url"
                    controls
                    class="max-w-xs rounded shadow"
                ></video>

                <!-- Other files -->
                <div v-else class="flex items-center space-x-2 bg-gray-200 p-2 rounded shadow">
                    <i class="fa-solid fa-file"></i>
                    <span class="text-sm">{{ file.name }}</span>
                </div>
            </div>
        </div>

        <!-- Timestamp -->
        <span class="text-xs text-gray-300 mt-1 self-end">
            {{ formattedDate }}
        </span>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'

const props = defineProps({
    msg: {
        type: Object,
        required: true
    }
})

const userStore = useUserStore()

// check if the message is sent by the connected user
const isOwnMessage = computed(() => props.msg.from === userStore.user.uniqueId)

// date formatting
const formattedDate = computed(() => {
    if (!props.msg.timestamp) return ''
    const date = new Date(props.msg.timestamp)
    return date.toLocaleString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: 'short'
    })
})
</script>