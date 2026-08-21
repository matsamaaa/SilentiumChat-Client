import createAxiosInstance from "../axios";
import { useNotificationStore } from "../notifications";

// create invitation
export async function createInvitation(urls, serverCode, userId, encryptedPayload) {
    const axiosInstance = createAxiosInstance();
    try {
        const response = await axiosInstance.post(`${urls.backend}/invitation`, { serverCode, userId, encryptedPayload });
        return response.data.datas;
    } catch (error) {
        console.error("Error fetching friend status:", error);
        throw error;
    }
}

export async function deleteInvitation(urls, serverCode, userId) {
    const axiosInstance = createAxiosInstance();

    try {
        const response = await axiosInstance.delete(`${urls.backend}/invitation`, { data: { serverCode, userId } });
        return response.data;
    } catch (error) {
        console.error("Error deleting invitation:", error);
        throw error;
    }
}