<template>
    <div class="flex items-center justify-center h-[93vh] w-full">
            
        <div class="w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-xl text-center">
            
            <LoadingIcon v-if="loading" />
            
            <div v-else="!validated">
                <FontAwesomeIcon
                    class="text-6xl"
                    :class="{
                        'text-green-500': validated,
                        'text-red-500': !validated
                    }" 
                    :icon="validated ? `circle-check` : `circle-xmark`" 
                    />

                <h1 
                    class="text-3xl font-semibold mt-4"
                    :class="{
                        'text-green-600': validated,
                        'text-red-600': !validated
                    }">
                    {{ validated ? 'Email updated!' : 'Verification failed' }}
                </h1>
                
                <p class="mt-2 text-md text-gray-600">
                    {{ validated ? 
                        'Your new email address has been successfully updated.' : 
                        (message || 'The verification link is invalid or has expired.')
                    }}
                </p>
            </div>

        </div>

    </div>
</template>

<script setup>
import LoadingIcon from '~/components/ui/icons/LoadingIcon.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import { useApiStore } from '#imports';

const apiStore = useApiStore();

const route = useRoute();

const token = ref(route.query.token || '');
const id = ref(route.query.id || '');
const loading = ref(false);
const validated = ref(false);
const message = ref(null);

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