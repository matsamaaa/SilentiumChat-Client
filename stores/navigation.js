import { defineStore } from 'pinia'
import { useRouter } from '#imports'

export const useNavigationStore = defineStore('navigation', {
    state: () => ({
        routesWithoutConnection: ['login', 'register', '/error', '/password'],
    }),
    actions: {
        isRouteWithoutConnection(routeName) {
            const routesWithoutConnection = this.routesWithoutConnection.map(route => {
                if(route.startsWith('/')) {
                    return routeName.includes(route.replaceAll('/', ''));
                } else {
                    return routeName === route ? true : false;
                }
            });
            return routesWithoutConnection.includes(true);
        },
        goToError(error = 404, message = 'Page not found') {
            const router = useRouter();
            router.push({ path: `/error/${error}`, query: { message } });
        },

        goToRegister() {
            const router = useRouter();
            router.push({ name: 'register' });
        },

        goToLogin() {
            const router = useRouter();
            router.push({ name: 'login' });
        },

        goToHome() {
            const router = useRouter();
            router.push({ name: 'index' })
        },

        goToMessaging(user) {
            const router = useRouter();
            router.push(`/messages/${user}`);
        },

        goToWaitingMessages() {
            const router = useRouter();
            router.push('/?waiting=true');
        },

        goToSettings() {
            const router = useRouter();
            router.push({ name: 'settings' });
        },

        goToServerCreation() {
            const router = useRouter();
            router.push(`/server/create`);
        },

        goToChannelCreation(code) {
            const router = useRouter();
            router.push(`/server/${code}/channel/create`)
        },

        goToServer(code) {
            const router = useRouter();
            router.push(`/server/${code}`);
        },

        goToFriends() {
            const router = useRouter();
            router.push({ name: 'friends' });
        }
    }
});