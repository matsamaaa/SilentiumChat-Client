<template>
    <div class="flex items-center justify-center h-[93vh] w-full">
        
        <div class="w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-xl text-center">
            
            <div v-if="loading">
                <svg class="animate-spin h-10 w-10 text-indigo-500 mx-auto" 
                     xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" 
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                
                <h1 class="text-3xl font-semibold mt-4 text-gray-800">Verification in progress...</h1>
                <p class="mt-2 text-md text-gray-600">Please wait.</p>
            </div>

            <div v-else-if="validated && !loading">
                <FontAwesomeIcon class="text-6xl text-green-500" icon="circle-check" />
                <h1 class="text-3xl font-semibold mt-4 text-green-600">Email updated!</h1>
                <p class="mt-2 text-md text-gray-600">Your new email address has been successfully updated.</p>
            </div>

            <div v-else-if="!validated && !loading">
                <FontAwesomeIcon class="text-6xl text-red-500" icon="circle-xmark" />
                <h1 class="text-3xl font-semibold mt-4 text-red-600">Verification failed</h1>
                <p class="mt-2 text-md text-gray-600">{{ message || 'The verification link is invalid or has expired.' }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useApiStore } from '#imports';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const route = useRoute();
const apiStore = useApiStore();

const loading = ref(false);
const validated = ref(false);
const message = ref(null);

const token = ref(route.query.token || '');
const id = ref(route.query.id || '');

onMounted(async () => {
    loading.value = true;
    const response = await apiStore.postVerificationChangeMail(id.value, token.value);
    loading.value = false;

    if (response && response.success) {
        validated.value = true;
    } else {
        validated.value = false;
        message.value = response?.message || null;
    }
});
</script>