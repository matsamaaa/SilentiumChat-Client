import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import '@fortawesome/fontawesome-svg-core/styles.css'

// Prevent FontAwesome from adding its CSS automatically
config.autoAddCss = false

// Import of icons
import { faPlus, faXmark, faFile, faDownload, faUserPlus, faClock, faCheck, faBan, faPaperPlane, faLock, faCircleExclamation } from '@fortawesome/free-solid-svg-icons'

// add icons
library.add(faPlus, faXmark, faFile, faDownload, faUserPlus, faClock, faCheck, faBan, faPaperPlane, faLock, faCircleExclamation)

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('FontAwesomeIcon', FontAwesomeIcon)
})
