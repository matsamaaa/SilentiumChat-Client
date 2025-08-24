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

        <!-- Prévisualisation si image -->
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
import { ref } from 'vue';

const fileName = ref(null);
const preview = ref(null);

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        fileName.value = file.name;

        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.value = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            preview.value = null;
        }
    }
}
</script>
