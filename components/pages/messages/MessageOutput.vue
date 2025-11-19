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
                    class="max-w-xs rounded shadow cursor-pointer hover:opacity-90"
                    @click="openImage(file.url, `${file.name}.${file.extension}`)"
                />

                <!-- Videos -->
                <video
                    v-else-if="['mp4', 'mov', 'webm', 'ogg'].includes(file.extension)"
                    :src="file.url"
                    :alt="file.name"
                    controls
                    class="max-w-xs rounded shadow"
                ></video>

                <!-- Other files -->
                <div v-else class="flex items-center space-x-2 bg-gray-200 p-2 rounded shadow">
                    <div class="flex items-center space-x-2">
                        <i class="fa-solid fa-file"></i>
                        <span class="text-sm">{{ file.name }}</span>
                    </div>
                    <DownloadIcon :url="file.url" :filename="`${file.name}.${file.extension}`" />
                </div>
            </div>
        </div>

        <!-- Timestamp -->
        <span class="text-xs text-gray-300 mt-1 self-end">
            {{ formattedDate }}
        </span>

        <!-- Lightbox (agrandissement image) -->
        <div 
            v-if="selectedImage" 
            class="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
        >
            <!-- Boutons top-right -->
            <div class="absolute top-4 right-4 flex space-x-4 text-white text-2xl">

                <!-- Bouton download -->
                <DownloadIcon :url="selectedImage.url" :filename="selectedImage.alt" />

                <!-- Bouton close -->
                <button @click="selectedImage = null" class="hover:text-red-400 transition">
                    <FontAwesomeIcon :icon="['fas', 'xmark']" />
                </button>
            </div>

            <!-- Image affichée -->
            <img 
                :src="selectedImage.url" 
                :alt="selectedImage.alt" 
                class="max-w-full max-h-full rounded shadow-lg"
            />
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import DownloadIcon from '~/components/messages/DownloadIcon.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

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

const selectedImage = ref(null)
const openImage = (url, alt) => {
    selectedImage.value = {
        url,
        alt
    }
}
</script>