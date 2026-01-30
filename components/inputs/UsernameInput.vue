<template>
    <div class="flex justify-center items-center mx-2">
        <!-- Input de recherche -->
        <input
            v-model="query"
            @keyup.enter="searchUser"
            type="text"
            placeholder="username#0001"
            class="flex-1 px-3 py-2 rounded-md bg-gray-800 text-white focus:outline-none"
        />
    </div>
</template>

<script setup>
import { ref } from 'vue'

const query = ref('')
const emit = defineEmits(['search'])

const searchUser = () => {
    if (!query.value.trim()) return

    // check format username#0001
    const match = query.value.match(/^([^#]+)#(\d{4})$/)
    if (!match) {
        emit('error', 'Invalid format. Use: username#0001');
        return;
    }

    const username = match[1]
    const code = match[2]

    emit('search', { username, code })
    query.value = ''
}
</script>