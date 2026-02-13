export const useServersStore = defineStore('servers', {
    state: () => ({
        servers: {}
    }),
    getters: {
        getServerByCode: (state) => (code) => {
            return state.servers[code];
        }
    },
    actions: {
        async initialize() {
            const apiStore = useApiStore();
            const userStore = useUserStore();

            try {
                const serversData = await apiStore.getUserServers(userStore.user.uniqueId);
                console.log("Fetched user servers:", serversData);
                serversData.forEach(server => {
                    this.addServer(server.code, server.banner, server.icon, server.name);
                });
            } catch (error) {
                console.error("Error initializing servers store:", error);
            }
        },

        async addServer(code, banner, icon, name) {
            const existing = this.getServerByCode(code);
            const iconUrl = icon ? await useApiStore().getServerIcon(code) : null;
            if (existing) {
                const updated = { ...existing };
                if (banner !== undefined) updated.banner = banner;
                if (icon !== undefined) updated.icon = iconUrl;
                if (name !== undefined) updated.name = name;
                this.servers[code] = updated;
                return;
            }

            this.servers[code] = { code, banner, icon: iconUrl, name };
        },

        async updateServerBanner(code, banner) {
            console.log(`Updating banner for server ${code}:`, banner);
            if (this.servers[code]) {
                this.servers[code].banner = banner;
            }
        },

        async updateServerIcon(code, icon) {
            console.log(`Updating icon for server ${code}:`, icon);
            if (this.servers[code]) {
                this.servers[code].icon = icon;
            }
        },
    }
});