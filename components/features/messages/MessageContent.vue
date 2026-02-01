<template>
    <div 
        :class="[ 
            'flex flex-col p-2 my-2 max-w-md break-words max-w-[60vw]',
            isOwnMessage ? 'self-end bg-indigo-600 rounded-l-lg rounded-br-lg' : 'self-start bg-gray-500 rounded-r-lg rounded-bl-lg',
            !isDecryptable ? '!opacity-75': ''
        ]"
    >

        <!-- Message text -->
        <p 
            class="whitespace-pre-wrap text-sm select-none text-white" 
            :class="{
                'text-right': isOwnMessage
            }">
                {{ displayedText }}
        </p>

        <!-- Files -->
        <div v-if="message.files?.length" class="mt-2 space-y-2">
            <div v-for="file in message.files" :key="file.name">

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
        <span class="text-xs text-gray-300 mt-1 self-end select-none">
            {{ formattedDate }}
        </span>

        <UpScaleImageContent 
            v-if="selectedImage" 
            :url="selectedImage.url" 
            :alt="selectedImage.alt" 
            @close="selectedImage = null"
        />
        
    </div>
</template>

<script setup>
import DownloadIcon from '~/components/ui/icons/DownloadIcon.vue';
import UpScaleImageContent from '~/components/features/messages/UpScaleImageContent.vue';

const props = defineProps({
    message: {
        type: Object,
        required: true
    },
    isOwnMessage: {
        type: Boolean,
        required: true
    }
});

const displayedText = computed(() => {
    return props.isOwnMessage
        ? (props.message.encryptedMessageBySender ?? '')
        : (props.message.encryptedMessage ?? '');
});

const isDecryptable = computed(() => {
    return displayedText.value !== "This message could not be decrypted.";
});

const selectedImage = ref(null);

const formattedDate = computed(() => {
    if (!props.message.timestamp) return ''
    const date = new Date(props.message.timestamp)
    return date.toLocaleString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: 'short'
    })
})

const openImage = (url, alt) => {
    selectedImage.value = {
        url,
        alt
    }
}
</script>