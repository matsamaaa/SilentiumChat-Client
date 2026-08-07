export const uploadServerAssets = async (apiStore, code, { banner, icon }) => {
    if (banner?.file) await apiStore.uploadServerBanner(code, banner.file);
    if (icon?.file) await apiStore.uploadServerIcon(code, icon.file);
};