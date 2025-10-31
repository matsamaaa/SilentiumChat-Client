import createAxiosInstance from "../axios";

// status
export async function getFriendStatus(urls, userId) {
    const axiosInstance = createAxiosInstance();
    try {
        const response = await axiosInstance.get(`${urls.backend}/friends/${userId}/status`);
        return response.data.datas;
    } catch (error) {
        console.error("Error fetching friend status:", error);
        throw error;
    }
}

// manage friends
export async function sendFriendRequest(urls, userId) {
    const axiosInstance = createAxiosInstance();
    try {
        const response = await axiosInstance.post(`${urls.backend}/friends/${userId}/request`);
        return response.data.datas;
    } catch (error) {
        console.error("Error sending friend request:", error);
        throw error;
    }
}

export async function blockUser(urls, userId) {
    const axiosInstance = createAxiosInstance();
    try {
        const response = await axiosInstance.post(`${urls.backend}/friends/${userId}/block`);
        return response.data;
    } catch (error) {
        console.error("Error blocking user:", error);
        throw error;
    }
}

export async function unblockUser(urls, userId) {
    const axiosInstance = createAxiosInstance();
    try {
        const response = await axiosInstance.post(`${urls.backend}/friends/${userId}/unblock`);
        return response.data;
    } catch (error) {
        console.error("Error unblocking user:", error);
        throw error;
    }
}

export async function cancelFriendRequest(urls, userId) {
    const axiosInstance = createAxiosInstance();
    try {
        const response = await axiosInstance.post(`${urls.backend}/friends/${userId}/cancel`);
        return response.data;
    } catch (error) {
        console.error("Error cancelling friend request:", error);
        throw error;
    }
}

// manage status
export async function acceptFriendRequest(urls, userId) {
    const axiosInstance = createAxiosInstance();
    try {
        const response = await axiosInstance.post(`${urls.backend}/friends/${userId}/accept`);
        return response.data;
    } catch (error) {
        console.error("Error accepting friend request:", error);
        throw error;
    }
}

export async function refuseFriendRequest(urls, userId) {
    const axiosInstance = createAxiosInstance();
    try {
        const response = await axiosInstance.post(`${urls.backend}/friends/${userId}/refuse`);
        return response.data;
    } catch (error) {
        console.error("Error refusing friend request:", error);
        throw error;
    }
}