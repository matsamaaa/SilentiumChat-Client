<template>
    <div>
        <div v-if="!userStore.initialized" class="flex-1 flex items-center justify-center">
            <span>Loading...</span>
        </div>
        <template v-else>
            <div class="min-h-screen flex flex-col bg-gray-900 text-white">
                <!-- Header -->
                <header class="bg-blue-600 p-4 h-[7vh] flex items-center justify-between">
                    <h1 class="text-xl font-bold cursor-pointer" @click="navigationStore.goToHome">SilentiumChat</h1>
                    <div v-if="userStore.isLoggedIn" class="flex flex-row gap-3 justify-center items-center">
                        <AvatarIcon/>
                        <a @click="navigationStore.goToSettings" class="cursor-pointer">{{ userStore.user.username }}</a>
                        <button @click="userStore.logout" class="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">Logout</button>
                    </div>
                </header>

                <!-- Contenu principal -->
                <main class="flex-1 overflow-y-auto overflow-x-hidden">
                    <slot />
                </main>

                <Notification />
            </div>
        </template>
    </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
import { useNavigationStore } from '@/stores/navigation'
import { useWebSocketStore } from '@/stores/ws'
import { useRoute } from 'vue-router'
import AvatarIcon from '~/components/users/AvatarIcon.vue'
import Notification from '~/components/popups/Notifications.vue'

const userStore = useUserStore()
const navigationStore = useNavigationStore()
const webSocketStore = useWebSocketStore()
const route = useRoute()

const checkConnectionAndRoute = (routeName) => {
    if (!userStore.isLoggedIn) {
        const isRouteWithoutConnection = navigationStore.isRouteWithoutConnection(routeName);
        if (!isRouteWithoutConnection) {
            navigationStore.goToLogin();
        }
        //if (route.name !== 'login' && route.name !== 'register') navigationStore.goToLogin();
    } else {
        webSocketStore.connect(userStore.user.uniqueId, userStore.token);
    }
}

onMounted(() => {
    checkConnectionAndRoute(route.name);
})

watch(() => route.name, () => {
    checkConnectionAndRoute(route.name);
});
</script>