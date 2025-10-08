<template>
  <aside class="flex flex-col w-64 border-r border-gray-700 bg-gray-900 shadow-xl p-4">
    <h2 class="text-xl font-bold text-gray-100 mb-6">Paramètres du Compte</h2>
    
    <nav class="space-y-2">
      <button 
        v-for="tab in tabs"
        :key="tab.id"
        class="w-full text-left px-4 py-2 rounded-lg transition duration-150"
        :class="{
          // Onglet ACTIF: On garde le bleu/indigo vif, il contraste bien.
          'bg-indigo-600 text-white font-semibold hover:bg-indigo-500': activeTab === tab.id,
          
          // Onglet INACTIF: 
          // text-gray-300 pour le texte, 
          // hover:text-indigo-400 (un bleu plus clair), 
          // hover:bg-gray-800 (un fond sombre mais différent du 900)
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
  { id: 'profile', label: 'Profil' }, 
  { id: 'security', label: 'Sécurité & Connexion' }, 
  { id: 'blocked', label: 'Utilisateurs Bloqués' }, 
  { id: 'notifications', label: 'Notifications' },
];
</script>