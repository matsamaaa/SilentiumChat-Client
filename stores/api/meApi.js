import createAxiosInstance from "../axios";

// stores
import { useUserStore } from "#imports";
import { useNotificationStore } from "#imports";

// username
export async function updateUsername(urls, newUsername) {
    const axiosInstance = createAxiosInstance();
    const notif = useNotificationStore();
    try {
        const response = await axiosInstance.patch(`${urls.backend}/me/username`, { username: newUsername });
        if (response.data.success) {
            const userStore = useUserStore();
            userStore.updateUsername(newUsername);
            notif.add("Username updated successfully", "success");
        }
        return response.data;
    } catch (error) {
        console.error("Error updating username:", error);
        throw error;
    }
}

// tag
export async function updateTag(urls, newTag) {
    const axiosInstance = createAxiosInstance();
    const notif = useNotificationStore();
    try {
        const response = await axiosInstance.patch(`${urls.backend}/me/tag`, { tag: newTag });
        if (response.data.success) {
            const userStore = useUserStore();
            userStore.updateTag(newTag);
            notif.add("Tag updated successfully", "success");
        }
        return response.data;
    } catch (error) {
        console.error("Error updating tag:", error);
        throw error;
    }
}

// avatar
export async function getAvatar(urls, userId) {
    const axiosInstance = createAxiosInstance();
    const userStore = useUserStore();
    let url;
    if (userId) {
        url = `${urls.backend}/user/${userId}/avatar`;
    } else {
        url = `${urls.backend}/me/avatar`;
    }
    try {
        const response = await axiosInstance.get(url, {
            responseType: 'arraybuffer',
        });
        if (response.status === 204) {
            return null;
        }
        const contentType = response.headers['content-type'] || 'image/jpeg';
        const blob = new Blob([response.data], { type: contentType });
        const imageUrl = URL.createObjectURL(blob);
        
        if(!userId) userStore.avatar = imageUrl;
        return imageUrl;
    } catch (error) {
        if (error.response) {
            return null; 
        } 
        
        throw error;
    }
}

export async function uploadAvatar(urls, file) {
    const axiosInstance = createAxiosInstance();
    const notif = useNotificationStore();
    const formData = new FormData();
    // 'avatar' doit correspondre au champ défini dans le backend (upload.single('avatar'))
    formData.append('avatar', file);
    try {
        const response = await axiosInstance.post(
            `${urls.backend}/me/avatar`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    const { loaded, total } = progressEvent;
                    const percent = Math.round((loaded * 100) / total);
                    console.log(`Avatar upload progress: ${percent}%`);
                }
            }
        );
        if (response.data.success) {
            const userStore = useUserStore();
            // Si le backend renvoie l’URL publique du nouvel avatar
            userStore.updateAvatar(response.data.avatarUrl);
            notif.add("Avatar uploaded successfully", "success");
        }
        return response.data;
    } catch (error) {
        console.error("Error uploading avatar:", error);
        throw error;
    }
}

export async function deleteAvatar(urls) {
    const axiosInstance = createAxiosInstance();
    try {
        const response = await axiosInstance.delete(`${urls.backend}/me/avatar`);
        if (response.data.success) {
            const userStore = useUserStore();
            userStore.avatar = null;
            const notif = useNotificationStore();
            notif.add("Avatar deleted successfully", "success");
        }
        return response.data;
    } catch (error) {
        if (error.response) {
            return null; 
        } 
        
        throw error;
    }
}

// password
export async function updatePassword(urls, newPassword, passwordConfirmation, currentPassword) {
    const axiosInstance = createAxiosInstance();
    try {
        const response = await axiosInstance.patch(`${urls.backend}/me/password/update`, {
            newPassword,
            passwordConfirmation,
            currentPassword
        });
        if (response.data.success) {
            const notif = useNotificationStore();
            notif.add("Password updated successfully", "success");
        }
        return response.data;
    } catch (error) {
        console.error("Error updating password:", error);
        throw error;
    }
}

export async function isValidPassword(urls, password) {
    const axiosInstance = createAxiosInstance();
    try {
        const response = await axiosInstance.post(`${urls.backend}/me/password/validate`, {
            password
        });
        return response.data;
    } catch (error) {
        console.error("Error validating password:", error);
        throw error?.response?.data.message || error;
    }
}