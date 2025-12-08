import createAxiosInstance from "../axios";

export async function postVerificationChangeMail(urls, id, token) {
    const axiosInstance = createAxiosInstance();

    try {
        const response = await axiosInstance.post(`${urls.backend}/verification/mail/change`, {
            id: id,
            token: token
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching verification change mail info:", error);
        throw error;
    }
}