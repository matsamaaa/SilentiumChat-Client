<template>
  <aside class="flex flex-col w-64 border-r border-gray-700 bg-gray-900 shadow-xl p-4">
    <h2 class="text-xl font-bold text-gray-100 mb-6">Account Settings</h2>
    
    <nav class="space-y-2">
      <button 
        v-for="tab in tabs"
        :key="tab.id"
        class="w-full text-left px-4 py-2 rounded-lg transition duration-150"
        :class="{
          'bg-indigo-600 text-white font-semibold hover:bg-indigo-500': activeTab === tab.id,
          'text-gray-300 hover:text-indigo-400 hover:bg-gray-800': activeTab !== tab.id
        }"
        @click="$emit('changeTab', tab.id)"
      >
        {{ tab.label }}
      </button>
    </nav>
  </aside>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

// Définition des propriétés (props)
defineProps({
  activeTab: {
    type: String,
    required: true
  }
});

// Définition des événements (emits)
defineEmits(['changeTab']);

// Liste des onglets de navigation (inchangée)
const tabs = [
  { id: 'profile', label: 'Profile' }, 
  { id: 'security', label: 'Sécurity & Connexion' }, 
  { id: 'blocked', label: 'Blocked Users' }, 
  { id: 'notifications', label: 'Notifications' },
];
</script>