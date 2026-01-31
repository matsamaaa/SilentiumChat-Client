<template>
    <div>
        <div class="mt-1 flex items-center w-full sm:w-96 border border-gray-600 bg-gray-900 rounded-md shadow-sm focus-within:border-indigo-600 focus-within:ring-1">
            <input
                :id="usernameId"
                type="text"
                :value="usernameModel"
                placeholder="Username"
                class="block flex-1 px-3 py-2 bg-gray-900 text-white focus:outline-none sm:text-sm rounded-l-md rounded-r-none focus:ring-0"
                @input="onUsernameInput"
            >

            <span class="text-gray-500 px-2">#</span>

            <input
                :id="tagId"
                type="text"
                inputmode="numeric"
                autocomplete="off"
                :value="tagModel"
                placeholder="0000"
                class="w-16 px-2 py-2 text-center bg-gray-700 text-gray-300 font-mono focus:outline-none sm:text-sm rounded-l-none rounded-r-md"
                @input="onTagInput"
            />
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    username: {
        type: String,
        default: ''
    },
    tag: {
        type: String,
        default: ''
    },
    usernameId: {
        type: String,
        default: 'username'
    },
    tagId: {
        type: String,
        default: 'tag'
    },
});

const emit = defineEmits(['update:username', 'update:tag']);

const usernameModel = computed(() => props.username ?? '');
const tagModel = computed(() => props.tag ?? '');

const formatTag = (value) => {
    const digitsOnly = String(value ?? '').replace(/\D/g, '');
    return digitsOnly.length > 4 ? digitsOnly.slice(-4) : digitsOnly;
};

const onUsernameInput = (event) => {
    emit('update:username', event.target.value);
};

const onTagInput = (event) => {
    emit('update:tag', formatTag(event.target.value));
};
</script>
