<template>
  <div class="flex flex-row ">
    <QuitButton 
      v-if="deviceStore.isMobile"
      @execute="navigationStore.goToHome()"
      />
    <div 
      class="shadow-xl/30 h-[94vh] bg-gray-900 flex flex-col border-r border-b border-gray-800 rounded-br-lg flex-shrink-0"
      :class="{
          'w-[30vw]': deviceStore.isTablet,
          'w-[25vw]': deviceStore.isMobile,
          'w-[13vw]': deviceStore.isDesktop
      }"
      >
      <SettingsSidebar 
        :activeTab="activeTab" 
        @change-tab="activeTab = $event" 
      />
    </div>
    <div class="flex flex-col p-5 w-full h-[100vh] gap-4"> 
      <SettingsContentWidget :currentTab="activeTab" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted, onMounted } from 'vue';
import SettingsSidebar from '~/components/sidebars/SettingsSidebar.vue';

import { useDeviceStore } from '#imports';
import { useNavigationStore } from '#imports';
import QuitButton from '~/components/buttons/QuitButton.vue';
import SettingsContentWidget from './SettingsContentWidget.vue';

const activeTab = ref('profile');
const deviceStore = useDeviceStore();
const navigationStore = useNavigationStore();

watch(() => deviceStore.isMobile, (isMobile) => {
    deviceStore.isDisabledServersBar = isMobile;
});

onUnmounted(() => {
    deviceStore.isDisabledServersBar = false;
});

onMounted(() => {
    if (deviceStore.isMobile) {
        deviceStore.isDisabledServersBar = true;
    }
});

</script>