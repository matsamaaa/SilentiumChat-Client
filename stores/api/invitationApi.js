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