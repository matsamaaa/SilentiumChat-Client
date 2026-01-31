<template>
    <div>
        <!-- Bouton personnalisé -->
        <label
            for="file-upload"
            class="cursor-pointer p-3 bg-indigo-600 text-white rounded-full shadow hover:bg-indigo-500 transition"
        >
            <FontAwesomeIcon :icon="['fas', 'plus']" />
        </label>

        <!-- Input caché -->
        <input
            id="file-upload"
            type="file"
            class="hidden"
            @change="handleFileUpload"
            ref="fileInput"
        />
    </div>
</template>

<script setup>
import { ref } from "vue";


const fileInput = ref(null);
const fileName = ref(null);
const preview = ref(null);

const emit = defineEmits(['file-selected']);

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
            emit('file-selected', { file, preview: e.target.result });
        };
        reader.readAsDataURL(file);

    } else if (file.type.startsWith("video/")) {
        const video = document.createElement("video");
        video.src = URL.createObjectURL(file);
        video.muted = true;
        video.preload = "metadata";
        video.playsInline = true;

        video.addEventListener("loadedmetadata", () => {
            video.currentTime = Math.min(0.1, video.duration / 2);
        });

        video.addEventListener("seeked", () => {
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            emit('file-selected', { file, preview: canvas.toDataURL("image/png") });
            URL.revokeObjectURL(video.src);
        });
    } else {
        emit('file-selected', { file, preview: null });
    }
}

const clearPreview = () => {
    fileName.value = null;
    preview.value = null;

    if (fileInput.value) {
        fileInput.value.value = "";
    }
}

defineExpose({
    clearPreview
});
</script>