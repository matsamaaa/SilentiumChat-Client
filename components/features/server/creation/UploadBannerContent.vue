<template>
    <div class="w-full">
        <button
            class="bg-indigo-600 text-white rounded-b-lg hover:bg-indigo-500 transition duration-150 shadow-md w-full h-48 overflow-hidden flex items-center justify-center p-0"
            @click="openFileDialog"
        >
            <img v-if="preview" :src="preview" alt="Server Banner Preview" class="w-full h-full rounded-b-lg object-cover block"/>
            <FontAwesomeIcon v-else icon="fa-solid fa-images" class="text-white text-2xl"/>
        </button>

        <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleServerIcon"
        />
    </div>
</template>

<script setup>
import { ref } from 'vue';

const fileInput = ref(null);
const preview = ref(null);

const emit = defineEmits(['update:icon']);

function openFileDialog() {
    if (fileInput.value) {
        fileInput.value.click();
    }
}

function handleServerIcon(event) {
    const file = event?.target?.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner une image valide.');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        preview.value = e.target.result;
        emit('update:icon', { file, preview: e.target.result });
    };
    reader.readAsDataURL(file);
}

const clearPreview = () => {
    preview.value = null;
    if (fileInput.value) {
        fileInput.value.value = '';
    }
};

defineExpose({
    clearPreview
});
</script>