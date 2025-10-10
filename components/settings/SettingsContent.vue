<template>
  <div>
    <h1 class="text-3xl font-extrabold text-gray-100 mb-8">
      {{ getTitle(currentTab) }}
    </h1>

    <ProfileSettings v-if="currentTab === 'profile'" />
    <SecuritySettings v-if="currentTab === 'security'" />
    <BlockedUsersSettings v-if="currentTab === 'blocked'" />
  </div>
</template>

<script setup>
import ProfileSettings from './sections/ProfileSettings.vue';
import SecuritySettings from './sections/SecuritySettings.vue';
import BlockedUsersSettings from './sections/BlockedUsersSettings.vue';

const props = defineProps({
  currentTab: {
    type: String,
    required: true
  }
});

const getTitle = (tab) => {
  switch (tab) {
    case 'profile':
      return 'Edit Profile';
    case 'security':
      return 'Manage Security and Password';
    case 'blocked':
      return 'Blocked Users List';
    case 'notifications':
      return 'Notification Preferences';
    default:
      return 'Settings';
  }
};
</script>