import axios from 'axios';
import { useApiStore } from './api';
import { useUserStore } from './user';

const apiStore = useApiStore();
const userStore = useUserStore();

const axiosInstance = axios.create({
  baseURL: apiStore.urls.backend, // Remplacez par votre URL de backend
});

// Ajouter un intercepteur pour inclure le token dans chaque requête
axiosInstance.interceptors.request.use(config => {
    const token = userStore.token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default axiosInstance;