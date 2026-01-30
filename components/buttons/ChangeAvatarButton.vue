<template>
    <div class="relative flex flex-col items-center justify-center">
        <!-- Bouton d'upload -->
        <button
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition duration-150 shadow-md"
            @click="openFileDialog"
        >
            Change Picture
        </button>

        <!-- Input caché -->
        <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleAvatarUpload"
        />
    </div>
</template>

<script setup>
import { ref } from "vue";

const fileInput = ref(null);
const preview = ref(null);

const emit = defineEmits(["avatar-selected"]);

function openFileDialog() {
    // Ouvre la boîte de sélection du fichier
    if (fileInput.value) {
        fileInput.value.click();
    }
}

function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
        alert("Veuillez sélectionner une image valide.");
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        preview.value = e.target.result;
        emit("avatar-selected", { file, preview: e.target.result });
    };
    reader.readAsDataURL(file);
}

const clearPreview = () => {
    preview.value = null;
    if (fileInput.value) {
        fileInput.value.value = "";
    }
};

defineExpose({
    clearPreview
});
</script>
