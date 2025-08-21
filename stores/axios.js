import axios from 'axios';
import { useApiStore } from './api';
import { useUserStore } from './user';

const createAxiosInstance = () => {
    const apiStore = useApiStore();
    const userStore = useUserStore();

    const instance = axios.create({
        baseURL: apiStore.urls.backend,
    });

    instance.interceptors.request.use(config => {
        const token = userStore.token;
        if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }, error => {
        return Promise.reject(error);
    });

    return instance;
}

export default createAxiosInstance;