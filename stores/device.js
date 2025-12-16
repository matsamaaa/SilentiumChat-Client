import { defineStore } from 'pinia'

export const useDeviceStore = defineStore('device', {
  state: () => ({
    isMobile: false,
    isTablet: false,
    isDesktop: true,

    isDisabledServersBar: false
  }),

  actions: {
    handleResize() {
      if (typeof window !== 'undefined') {
        const width = window.innerWidth
        if (width < 768) {
          this.isMobile = true
          this.isTablet = false
          this.isDesktop = false
        } else if (width >= 768 && width < 1524) {
          this.isMobile = false
          this.isTablet = true
          this.isDesktop = false
        } else {
          this.isMobile = false
          this.isTablet = false
          this.isDesktop = true
        }
      }
    }
  }
})
