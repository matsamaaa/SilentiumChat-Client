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
            serversStore.updateServerBanner(code, response.data.datas.banner);
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
            serversStore.updateServerIcon(code, response.data.datas.icon);
            notif.add("Icon uploaded successfully", "success");
        }
        return response.data;
    } catch (error) {
        console.error("Error uploading icon:", error);
        throw error;
    }
}