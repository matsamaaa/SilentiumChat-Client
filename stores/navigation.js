import { defineStore } from 'pinia'
import { useRouter } from '#imports'

export const useNavigationStore = defineStore('navigation', {
    actions: {
        goToError(error = 404, message = 'Page not found') {
            const router = useRouter();
            router.push({ name: 'error', params: { error, message } });
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
        }
    }
});