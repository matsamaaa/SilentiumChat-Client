<template>
    <div>
        <div v-if="!userStore.initialized" class="flex-1 flex items-center justify-center h-screen w-full bg-gray-900">
            <Loading />
        </div>
        <template v-else>
            <div class="flex flex-row overflow-y-auto overflow-x-hidden h-[100vh] w-[100vw]" >
                <ServersWidget v-if="connectedRoute && !deviceStore.isDisabledServersBar" />
                <ProfilePlate v-if="connectedRoute && !deviceStore.isDisabledProfilePlate" />

                <main class="flex-1 bg-gray-900">
                    <slot />
                </main>

                <NotificationPopup />
            </div>
        </template>
    </div>
</template>

<script setup>
import NotificationPopup from '~/components/ui/popups/NotificationPopup.vue'
import ServersWidget from '~/components/features/ServersWidget.vue'
import ProfilePlate from '~/components/ui/ProfilePlate.vue'
import Loading from '~/components/features/Loading.vue'

import { 
    useUserStore, 
    useNavigationStore, 
    useWebSocketStore, 
    useDeviceStore 
} from '#imports';

const userStore = useUserStore()
const navigationStore = useNavigationStore()
const webSocketStore = useWebSocketStore()
const deviceStore = useDeviceStore()
const route = useRoute()

const connectedRoute = ref(false);

const checkConnectionAndRoute = (routeName) => {
    if (!userStore.isLoggedIn) {
        const isRouteWithoutConnection = navigationStore.isRouteWithoutConnection(routeName);
        if (!isRouteWithoutConnection) {
            navigationStore.goToLogin();
        }
        connectedRoute.value = false;
        //if (route.name !== 'login' && route.name !== 'register') navigationStore.goToLogin();
    } else {
        webSocketStore.connect(userStore.user.uniqueId, userStore.token);
        connectedRoute.value = true;
    }
}

onMounted(() => {
    checkConnectionAndRoute(route.name);
    deviceStore.handleResize()
    window.addEventListener('resize', deviceStore.handleResize)
})

onUnmounted(() => {
    window.removeEventListener('resize', deviceStore.handleResize)
})

watch(() => route.name, () => {
    checkConnectionAndRoute(route.name);
});
</script>