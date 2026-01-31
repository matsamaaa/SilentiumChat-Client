<template>
    <div>

        <h3 class="text-xl font-semibold text-gray-100 border-b border-gray-700 pb-2">Update Username</h3>
        <p class="text-gray-500 text-sm gap py-2">Your username is visible to all other users. The Tag is a unique four-digit identifier.</p>

        <UsernameTagInput
            v-model:username="usernameModel"
            v-model:tag="tagModel"
            usernameId="username"
            tagId="tag"
        />

    </div>
</template>

<script setup>
import UsernameTagInput from '~/components/ui/inputs/UsernameTagInput.vue';

const props = defineProps({
    username: {
        type: String,
        default: ''
    },
    tag: {
        type: String,
        default: ''
    }
});

const emit = defineEmits(['update:username', 'update:tag']);

const usernameModel = computed({
    get: () => props.username,
    set: (value) => emit('update:username', value)
});

const tagModel = computed({
    get: () => props.tag,
    set: (value) => emit('update:tag', value)
});
</script>