import axios from 'axios';
import { useApiStore } from './api';
import { useUserStore } from './user';
import { useNotificationStore } from './notifications';

const createAxiosInstance = () => {
    const apiStore = useApiStore();
    const userStore = useUserStore();
    const notif = useNotificationStore();

    const instance = axios.create({
        baseURL: apiStore.urls.backend,
    });

    instance.interceptors.request.use(config => {
        const token = userStore.token;
        const userId = userStore.user ? userStore.user.uniqueId : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            config.headers['x-user-id'] = userId;
        }
        return config;
    }, error => {
        return Promise.reject(error);
    });

    instance.interceptors.response.use(response => {
        const res = response.data;

        if (res && res.success === false) {
            notif.add(res.message || 'An error occurred', 'error');
        }

        return response;
    }, error => {
        const notificationStore = useNotificationStore();
        notificationStore.add(
            error.response?.data?.message || 'Communication error with the server',
            'error'
        );
        return Promise.reject(error);
    });

    return instance;
}

export default createAxiosInstance;