import createAxiosInstance from "../axios";
import { useNotificationStore } from "../notifications";
import { useServersStore } from "../servers";

export async function createServer(urls, name, owner) {
    const axiosInstance = createAxiosInstance();
    const notif = useNotificationStore();
    try {
        const response = await axiosInstance.post(`${urls.backend}/server/create`, { name, owner });
        notif.add("Server created successfully", "success");

        const server = response.data.datas;
        const serversStore = useServersStore();
        serversStore.addServer(server.code, server.banner, server.icon, server.name);

        return server;
    } catch (error) {
        console.error("Error creating server:", error);
        throw error;
    }
}

export async function uploadServerBanner(urls, code, file) {
    const axiosInstance = createAxiosInstance();
    const notif = useNotificationStore();
    const formData = new FormData();

    formData.append('banner', file);
    try {
        const response = await axiosInstance.post(
            `${urls.backend}/server/${code}/banner`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    const { loaded, total } = progressEvent;
                    const percent = Math.round((loaded * 100) / total);
                    console.log(`Banner upload progress: ${percent}%`);
                }
            }
        );
        if (response.data.success) {
            console.log("Banner uploaded successfully:", response.data);
            notif.add("Banner uploaded successfully", "success");
        }
        return response.data;
    } catch (error) {
        console.error("Error uploading banner:", error);
        throw error;
    }
}

export async function uploadServerIcon(urls, code, file) {
    const axiosInstance = createAxiosInstance();
    const notif = useNotificationStore();
    const formData = new FormData();

    formData.append('icon', file);
    try {
        const response = await axiosInstance.post(
            `${urls.backend}/server/${code}/icon`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    const { loaded, total } = progressEvent;
                    const percent = Math.round((loaded * 100) / total);
                    console.log(`Icon upload progress: ${percent}%`);
                }
            }
        );
        if (response.data.success) {
            console.log("Icon uploaded successfully:", response.data);
            notif.add("Icon uploaded successfully", "success");
        }
        return response.data;
    } catch (error) {
        console.error("Error uploading icon:", error);
        throw error;
    }
}

export async function getUserServers(urls, userId) {
    const axiosInstance = createAxiosInstance();

    try {
        const response = await axiosInstance.get(`${urls.backend}/server/${userId}/servers`);
        if (response.data.success) {
            return response.data.datas.servers;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error fetching user servers:", error);
        throw error;
    }
}

export async function getServerIcon(urls, code) {
    const axiosInstance = createAxiosInstance();

    try {
        const response = await axiosInstance.get(`${urls.backend}/server/${code}/icon`, {
            responseType: 'arraybuffer',
        });

        if (response.data.success && response.status === 404) return null;

        const contentType = response.headers['content-type'] || 'image/jpeg';
        const blob = new Blob([response.data], { type: contentType });
        const imageUrl = URL.createObjectURL(blob);
        
        return imageUrl;
    } catch (error) {
        if (error.response) {
            return null; 
        } 
        
        throw error;
    }
}

export async function getServerBanner(urls, code) {
    const axiosInstance = createAxiosInstance();

    try {
        const response = await axiosInstance.get(`${urls.backend}/server/${code}/banner`, {
            responseType: 'arraybuffer',
        });

        if (response.data.success && response.status === 404) return null;

        const contentType = response.headers['content-type'] || 'image/jpeg';
        const blob = new Blob([response.data], { type: contentType });
        const imageUrl = URL.createObjectURL(blob);
        
        return imageUrl;
    } catch (error) {
        if (error.response) {
            return null; 
        } 
        
        throw error;
    }
}

export async function createServerChannel(urls, code, name, description) {
    const axiosInstance = createAxiosInstance();
    const serversStore = useServersStore();
    
    try {
        const response = await axiosInstance.post(`${urls.backend}/server/${code}/channel/create`, {
            name,
            description
        });

        const channel = response.data.datas.channel;
        serversStore.addChannelToServer(code, channel);
        return;
    } catch (error) {
        throw error;
    }
}