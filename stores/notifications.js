// /stores/notification.js
import { defineStore } from 'pinia';

export const useNotificationStore = defineStore('notification', {
    state: () => ({
        notifications: [],
    }),
    actions: {
        add(message, type = 'info', duration = 4000) {
            const id = Date.now() + Math.random();
            this.notifications.push({ id, message, type });
            if (duration > 0) {
                setTimeout(() => this.remove(id), duration);
            }
        },
        remove(id) {
            this.notifications = this.notifications.filter(n => n.id !== id);
        },
    },
});