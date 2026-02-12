export const useStatusStore = defineStore('status', {
    state: () => ({
        status: {}
    }),
    getters: {
        getStatusByUserId: (state) => (userId) => {
            return state.status[userId];
        }
    },
    actions: {
        async initializeStatus(userId) {
            const apiStore = useApiStore();
            const status = await apiStore.getUserStatus(userId);
            this.status[userId] = status || 'offline';
            console.log(`Initialized status for user ${userId}:`, status);
            console.log('Current status store:', this.status);
        },

        async updateStatus(userId, status) {
            this.status[userId] = status || 'offline';
            console.log(`Updated status for user ${userId}:`, status);
        }
    }
});