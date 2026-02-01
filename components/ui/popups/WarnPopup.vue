<template>
    <div class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 h-screen !mt-0">
        <div class="bg-gray-800 rounded-lg shadow-2xl p-6 w-full max-w-sm space-y-3 transform transition-all duration-300 scale-100 opacity-100">
            
            <h3 class="text-xl font-bold text-gray-100">Warn</h3>

            <hr class="border-gray-700">
            
            <p class="text-gray-300">
                <FontAwesomeIcon icon="fa-circle-exclamation" class="text-red-500 mr-2" />
                {{ message }}
            </p>

            <div class="flex justify-start space-x-4 mt-4">
                <AlertButton
                    text="Cancel"
                    @execute="close"
                    />
                <ConfirmButton
                    text="Confirm"
                    @saved="confirm"
                    />
            </div>
        </div>
    </div>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import AlertButton from '../buttons/AlertButton.vue';
import ConfirmButton from '../buttons/ConfirmButton.vue';
import QuitIcon from '../icons/QuitIcon.vue';

const emit = defineEmits(['close', 'confirm']);

const props = defineProps({
    message: {
        type: String,
        required: true
    }
});

const confirm = () => {
    emit('confirm');
};

const close = () => {
    emit('close');
};
</script>