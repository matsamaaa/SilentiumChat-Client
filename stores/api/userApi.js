import createAxiosInstance from "../axios";

// keys
export async function getUserPublicKey(urls, userId) {
    const axiosInstance = createAxiosInstance();
    try {
        const response = await axiosInstance.get(`${urls.backend}/user/${userId}/publicKey`);
        return response.data.datas.publicKey;
    } catch (error) {
        console.error("Error fetching user public key:", error);
        throw error;
    }
}

// username
export async function getUsername(urls, userId) {
    const axiosInstance = createAxiosInstance();
    try {
        const response = await axiosInstance.get(`${urls.backend}/user/${userId}/username`);
        return response.data.datas.username;
    } catch (error) {
        console.error("Error fetching username:", error);
        throw error;
    }
}

export async function getUserTag(urls, userId) {
    const axiosInstance = createAxiosInstance();
    try {
        const response = await axiosInstance.get(`${urls.backend}/user/${userId}/tag`);
        return response.data.datas.tag;
    } catch (error) {
        console.error("Error fetching username:", error);
        throw error;
    }
}

export async function getUserCreationDate(urls, userId) {
    const axiosInstance = createAxiosInstance();
    try {
        const response = await axiosInstance.get(`${urls.backend}/user/${userId}/creationdate`);
        return response.data.datas.creationDate;
    } catch (error) {
        console.error("Error fetching username:", error);
        throw error;
    }
}

export async function getUserIdByFullName(urls, username, code) {
    const axiosInstance = createAxiosInstance();
    try {
        const response = await axiosInstance.get(`${urls.backend}/user/${username}/${code}/id`);
        return response.data.datas.userId;
    } catch (error) {
        console.error("Error fetching user ID by full name:", error);
        throw error;
    }
}