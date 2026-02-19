<template>
    <div class="h-full">
        <section class="bg-gray-800 p-6 rounded-xl shadow-xl space-y-8 m-4">
        
            <div>
                <h2 class="text-xl font-semibold text-gray-100 mb-4 border-b border-gray-700 pb-2">Channel Creation</h2>
                <p class="text-sm text-gray-500">Create a channel so that people can chat in it.</p>
            </div>

            <br>
            <form @submit.prevent="createChannel" class="space-y-2 w-full sm:w-96">
                
                <label for="channel-name" class="block text-sm font-medium text-gray-300">Channel Name</label>
                <NormalInput
                    id="channel-name"
                    type="text"
                    v-model="name"
                    placeholder="Channel name"
                    required=true
                    />


                <label for="channel-description" class="block text-sm font-medium text-gray-300">Channel Description</label>
                <NormalInput
                    id="channel-description"
                    type="text"
                    v-model="description"
                    placeholder="Channel description"
                    required=false
                    />

                <br>

                <NormalButton 
                    label="Create Channel"
                    icon="fa-hashtag"
                    />
            </form>
        </section>
    </div>
</template>

<script setup>
import NormalButton from '~/components/ui/buttons/NormalButton.vue';
import NormalInput from '~/components/ui/inputs/NormalInput.vue';

import { useApiStore } from '#imports';

const apiStore = useApiStore();

const route = useRoute();
const code = route.params.code;

const name = ref('');
const description = ref('');

const createChannel = async () => {
    await apiStore.createServerChannel(code, name.value, description.value)
}
</script>