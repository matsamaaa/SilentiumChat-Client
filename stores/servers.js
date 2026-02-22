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
                    this.addServer(server.code, server.banner, server.icon, server.name, server.channels, server.members);
                });
            } catch (error) {
                console.error("Error initializing servers store:", error);
            }
        },

        async addServer(code, banner, icon, name, channels, members) {
            const existing = this.getServerByCode(code);
            const iconUrl = icon ? await useApiStore().getServerIcon(code) : null;
            const bannerUrl = banner ? await useApiStore().getServerBanner(code) : null;

            if (existing) {
                const updated = { ...existing };
                if (banner !== undefined) updated.banner = bannerUrl;
                if (icon !== undefined) updated.icon = iconUrl;
                if (name !== undefined) updated.name = name;
                this.servers[code] = updated;
                return;
            }

            this.servers[code] = { code, banner: bannerUrl, icon: iconUrl, name, channels, members};
        },

        async updateServerBanner(code, banner) {
            if (this.servers[code]) {
                this.servers[code].banner = banner;
            }
        },

        async updateServerIcon(code, icon) {
            if (this.servers[code]) {
                this.servers[code].icon = icon;
            }
        },

        async addChannelToServer(code, channel) {
            const server = this.getServerByCode(code);
            if (server) {
                server.channels.push(channel);
            }
        }
    }
});