import createAxiosInstance from "../axios";
import { useNotificationStore } from "../notifications";

export async function sendResetPasswordMail(email) {
    const axiosInstance = createAxiosInstance();
    const notif = useNotificationStore();
    try {
        const response = await axiosInstance.post(`/mail/password/reset`, { email: email });
        if (response.data.success) notif.add("Reset password mail sent successfully", "success");
        return response.data;
    } catch (error) {
        throw error;
    }
}