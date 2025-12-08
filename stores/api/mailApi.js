import createAxiosInstance from "../axios";
import { useNotificationStore } from "../notifications";

export async function sendResetPasswordMail(urls, email) {
    const axiosInstance = createAxiosInstance();
    const notif = useNotificationStore();
    try {
        const response = await axiosInstance.post(`${urls.backend}/mail/password/reset`, { email: email });
        if (response.data.success) notif.add("Reset password mail sent successfully", "success");
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function sendChangePasswordMail(urls, id, token, currentPassword, passwordConfirmation) {
    const axiosInstance = createAxiosInstance();
    try {
        const response = await axiosInstance.post(`${urls.backend}/mail/password/change`, {
            id,
            token,
            currentPassword,
            passwordConfirmation
        });
        return response.data;
    } catch (error) {
        console.error("Error resetting user password:", error);
        throw error;
    }
}

export async function sendChangeEmailMail(urls, id, newEmail, password) {
    const axiosInstance = createAxiosInstance();
    const notif = useNotificationStore();
    try {
        const response = await axiosInstance.post(`${urls.backend}/mail/email/change`, {
            id,
            newEmail,
            password
        });
        if (response.data.success) notif.add("Change email mail sent successfully", "success");
        return response.data;
    } catch (error) {
        console.error("Error sending change email mail:", error);
        throw error;
    }
}