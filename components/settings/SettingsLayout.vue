<template>
  <div class="flex w-screen h-screen pt-16 bg-gray-900 text-gray-100"> 
    
    <SettingsSidebar 
      :activeTab="activeTab" 
      @change-tab="activeTab = $event" 
    />
    
    <main class="flex-1 overflow-y-auto p-8">
      
      <SettingsContent :currentTab="activeTab" />
      
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import SettingsSidebar from './SettingsSidebar.vue';
import SettingsContent from './SettingsContent.vue';

const activeTab = ref('profile'); 
console.log(activeTab);
</script>