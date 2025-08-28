<template>
    <div class="flex flex-col items-center">
        <!-- Bouton personnalisé -->
        <label
            for="file-upload"
            class="cursor-pointer px-3 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition"
        >
            <FontAwesomeIcon :icon="['fas', 'plus']" />
        </label>

        <!-- Input caché -->
        <input
            id="file-upload"
            type="file"
            class="hidden"
            @change="handleFileUpload"
        />

        <!-- Prévisualisation si image ou vidéo -->
        <div v-if="preview" class="mt-4">
            <img :src="preview" alt="Aperçu" class="max-w-xs rounded-lg shadow" />
        </div>

        <!-- Nom du fichier -->
        <p v-if="fileName" class="mt-2 text-gray-700 text-sm">
            {{ fileName }}
        </p>
    </div>
</template>

<script setup>
import { ref } from "vue";

const fileName = ref(null);
const preview = ref(null);

const emit = defineEmits(['file-selected']);

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    fileName.value = file.name;
    emit('file-selected', file);

    if (file.type.startsWith("image/")) {
        // image gestion
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.value = e.target.result;
        };
        reader.readAsDataURL(file);

    } else if (file.type.startsWith("video/")) {
        // video gestion
        const video = document.createElement("video");
        video.src = URL.createObjectURL(file);
        video.muted = true;
        video.preload = "metadata";
        video.playsInline = true;

        video.addEventListener("loadedmetadata", () => {
            // choose next frame to not capture black screen
            video.currentTime = Math.min(0.1, video.duration / 2);
        });

        video.addEventListener("seeked", () => {
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            preview.value = canvas.toDataURL("image/png");

            URL.revokeObjectURL(video.src); 
        });
    } else {
        preview.value = null;
    }
}

function clearPreview() {
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
