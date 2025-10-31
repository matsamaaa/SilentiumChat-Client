import createAxiosInstance from "../axios";

export async function getFile(urls, fileId) {
    const axiosInstance = createAxiosInstance();
    try {
        const response = await axiosInstance.get(`${urls.backend}/files/${fileId}`, {
            responseType: 'arraybuffer',
        });
        // Convert ArrayBuffer en Uint8Array
        const fileBuffer = new Uint8Array(response.data);
        return fileBuffer;
    } catch (error) {
        console.error("Error fetching file:", error);
        throw error;
    }
}

export async function postFile(urls, fileData) {
    const axiosInstance = createAxiosInstance();
    const formData = new FormData();
    const file = new File([fileData.encryptedData], "file", { type: "application/octet-stream" });
    formData.append("file", file);
    formData.append("extension", fileData.extension);
    formData.append("iv", fileData.iv); // Uint8Array
    formData.append("authTag", fileData.authTag); // Uint8Array
    formData.append("encryptedKey", fileData.encryptedKey); // base64
    formData.append("encryptedKeySender", fileData.encryptedKeySender); // base64
    try {
        const response = await axiosInstance.post(
            `${urls.backend}/files/upload`, 
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                onUploadProgress: (progressEvent) => {
                    const { loaded, total } = progressEvent;
                    const percent = Math.round((loaded * 100) / total);
                    console.log(`File upload progress: ${percent}%`);
                }
            }
        );
        return response.data.datas;
    } catch (error) {
        console.error("Error posting file:", error);
        throw error;
    }
}

export async function getFileMetadata(urls, fileId) {
    const axiosInstance = createAxiosInstance();
    try {
        const response = await axiosInstance.get(`${urls.backend}/files/${fileId}/meta`);
        return response.data.datas;
    } catch (error) {
        console.error("Error fetching file metadata:", error);
        throw error;
    }
}