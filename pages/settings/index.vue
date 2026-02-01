<template>
  <div class="flex flex-row ">
    <QuitIcon 
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
      <SettingsSideBar 
        :activeTab="activeTab" 
        @change-tab="activeTab = $event" 
      />
    </div>
    <div class="flex flex-col p-5 w-full h-[100vh] gap-4"> 
      <SettingsWidget :currentTab="activeTab" />
    </div>
  </div>
</template>

<script setup>
import QuitIcon from '~/components/ui/icons/QuitIcon.vue';
import SettingsWidget from '~/components/features/settings/SettingsWidget.vue';
import SettingsSideBar from '~/components/features/settings/SettingsSideBar.vue';

import { useDeviceStore } from '#imports';
import { useNavigationStore } from '#imports';

const deviceStore = useDeviceStore();
const navigationStore = useNavigationStore();

const activeTab = ref('profile');

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