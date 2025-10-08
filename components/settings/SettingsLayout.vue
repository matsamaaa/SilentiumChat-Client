<template>
  <div class="flex w-screen h-screen pt-16 bg-gray-900 text-gray-100"> 
    
    <SettingsSidebar 
      :activeTab="activeTab" 
      @change-tab="activeTab = $event" 
    />
    
    <main class="flex-1 overflow-y-auto p-8">
      
      <SettingsContent :currentTab="activeTab" />
      
      <div class="mt-8 pt-4 border-t border-gray-700 flex justify-end">
        <button class="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-xl hover:bg-green-500 transition duration-150">
          Save Changes
        </button>
      </div>
      
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