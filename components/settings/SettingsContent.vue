<template>
  <div>
    <h1 class="text-3xl font-extrabold text-gray-900 mb-8">
      {{ getTitle(currentTab) }}
    </h1>

    <ProfileSettings v-if="currentTab === 'profile'" />
    <SecuritySettings v-else-if="currentTab === 'security'" />
    <BlockedUsersSettings v-else-if="currentTab === 'blocked'" />
    <div v-else class="text-gray-500">
      Sélectionnez une option dans le panneau de gauche pour commencer.
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
// Importe les sous-composants qui gèrent chaque section
import ProfileSettings from './sections/ProfileSettings.vue';
import SecuritySettings from './sections/SecuritySettings.vue';
import BlockedUsersSettings from './sections/BlockedUsersSettings.vue';

defineProps({
  currentTab: {
    type: String,
    required: true
  }
});

const getTitle = (tab) => {
  switch (tab) {
    case 'profile':
      return 'Modifier le Profil';
    case 'security':
      return 'Gérer la Sécurité et le Mot de Passe';
    case 'blocked':
      return 'Liste des Utilisateurs Bloqués';
    case 'notifications':
      return 'Préférences de Notifications';
    default:
      return 'Paramètres';
  }
};
</script>