import createAxiosInstance from "../axios";

// discussion
export async function getPrivateDiscussion(urls, to, page = 1) {
    const axiosInstance = createAxiosInstance();
    try {
        const response = await axiosInstance.get(`${urls.backend}/message/${to}/messages?page=${page}`);
        return response.data.datas;
    } catch (error) {
        console.error("Error fetching private discussion:", error);
        throw error;
    }
}

export async function updateDiscussionStatus(urls, to, status) {
    const axiosInstance = createAxiosInstance();
    try {
        const response = await axiosInstance.patch(`${urls.backend}/message/${to}/status`, { status });
        return response.data.datas;
    } catch (error) {
        console.error("Error updating discussion status:", error);
        throw error;
    }
}

export async function deleteAllDiscussions(urls) {
    const axiosInstance = createAxiosInstance();
    try {
        const response = await axiosInstance.delete(`${urls.backend}/message/discussions/delete`);
        return response.data;
    } catch (error) {
        console.error("Error deleting all discussions:", error);
        throw error;
    }
}

// message
export async function getLastMessages(urls) {
    const axiosInstance = createAxiosInstance();
    try {
        const response = await axiosInstance.get(`${urls.backend}/message/lastmessages`);
        return response.data.datas;
    } catch (error) {
        console.error("Error fetching last messages:", error);
        throw error;
    }
}