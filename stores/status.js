export const useStatusStore = defineStore('status', {
    state: () => ({
        status: {},
        users: {}
    }),
    getters: {
        getStatusByUserId: (state) => (userId) => {
            return state.status[userId];
        },
        getUserById: (state) => (userId) => {
            return state.users[userId];
        }
    },
    actions: {
        async initializeStatus(userId) {
            const apiStore = useApiStore();
            const status = await apiStore.getUserStatus(userId);
            this.status[userId] = status || 'offline';
            await this.addUser(userId);
        },

        async updateStatus(userId, status) {
            this.status[userId] = status || 'offline';
        },

        async addUser(id) {
            const user = this.getUserById(id);
            if (!user) {
                const apiStore = useApiStore();
                const username = await apiStore.getUsername(id);
                const avatar = await apiStore.getAvatar(id);
                const userData = { id, username, avatar };
                this.users[id] = userData;
            }
        }
    }
});