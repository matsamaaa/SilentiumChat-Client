<template>
    <div class="min-h-screen flex flex-col bg-gray-900 text-white">
        <!-- Header -->
        <header class="bg-blue-600 p-4 h-[7vh] flex items-center justify-between">
            <h1 class="text-xl font-bold">SilentiumChat</h1>

            <div v-if="userStore.isLoggedIn" class="flex flex-row gap-3">
                <p>{{ userStore.user.username }}</p>
                <button @click="userStore.logout" class="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">Logout</button>
            </div>
        </header>

        <!-- Contenu principal -->
        <main class="flex-1 overflow-y-auto">
            <slot />
        </main>
    </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
import { useNavigationStore } from '@/stores/navigation'
import { useWebSocketStore } from '@/stores/ws'

const userStore = useUserStore()
const navigationStore = useNavigationStore()
const webSocketStore = useWebSocketStore()

onMounted(() => {
    if (!userStore.isLoggedIn) {
        navigationStore.goToLogin();
    } else {
        webSocketStore.connect(userStore.user.uniqueId, userStore.token);
    }
})
</script>