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
        async addServer(code, banner, icon, name) {
            const server = { code, banner, icon, name };
            this.servers[code] = server;
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