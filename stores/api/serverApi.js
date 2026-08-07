import createAxiosInstance from "../axios";
import { useNotificationStore } from "../notifications";
import { useServersStore } from "../servers";
import { useNavigationStore } from "../navigation";

export async function createServer(urls, name, owner) {
    const axiosInstance = createAxiosInstance();
    const notif = useNotificationStore();

    try {
        const response = await axiosInstance.post(`${urls.backend}/server/create`, { name, owner });
        notif.add("Server created successfully", "success");

        const server = response.data.datas;
        const serversStore = useServersStore();
        serversStore.addServer(server.code, server.banner, server.icon, server.name, [], server.members, server.createdAt);
        return server;
    } catch (error) {
        console.error("Error creating server:", error);
        throw error;
    }
}

export async function deleteServer(urls, code) {
    const axiosInstance = createAxiosInstance();
    const notif = useNotificationStore();
    const serversStore = useServersStore();
    const navigationStore = useNavigationStore();

    try {
        const response = await axiosInstance.delete(`${urls.backend}/server/${code}`);
        notif.add("Server deleted successfully", "success");
        serversStore.removeServer(code);
        navigationStore.goToHome(); // Navigate to home after deletion
        return response.data;
    } catch (error) {
        console.error("Error deleting server:", error);
        throw error;
    }
}

export async function updateServerName(urls, code, name) {
    const axiosInstance = createAxiosInstance();
    const notif = useNotificationStore();

    try {
        const response = await axiosInstance.put(`${urls.backend}/server/${code}/name`, { name });
        const serversStore = useServersStore();
        const server = serversStore.getServerByCode(code);
        if (server) {
            server.name = name;
        }

        if (response.data.success) {
            console.log("Server name updated successfully:", response.data);
            notif.add("Server name updated successfully", "success");
        }
        return response.data;
    } catch (error) {
        console.error("Error updating server name:", error);
        throw error;
    }
}

export async function uploadServerBanner(urls, code, file) {
    const axiosInstance = createAxiosInstance();
    const notif = useNotificationStore();
    const serversStore = useServersStore();
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
            serversStore.updateServerBanner(code);
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
    const serversStore = useServersStore();
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
            serversStore.updateServerIcon(code);
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
            console.log("User servers fetched successfully:", response.data.datas.servers);
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