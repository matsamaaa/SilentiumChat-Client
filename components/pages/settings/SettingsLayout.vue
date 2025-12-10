<template>
  <div class="flex flex-row">
    <div class="shadow-xl/30 w-[13vw] h-[94vh] bg-gray-900 flex flex-col border-r border-b border-gray-800 rounded-br-lg flex-shrink-0">
      <SettingsSidebar 
        :activeTab="activeTab" 
        @change-tab="activeTab = $event" 
      />
    </div>
    <div class="flex flex-col p-5 w-full h-[100vh] gap-4"> 
      <SettingsContent :currentTab="activeTab" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import SettingsSidebar from './SettingsSidebar.vue';
import SettingsContent from './SettingsContent.vue';

const activeTab = ref('profile'); 
</script>