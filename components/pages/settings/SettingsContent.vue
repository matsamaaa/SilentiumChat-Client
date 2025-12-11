<template>
  <div class="h-full overflow-y-scroll">
    <h1 class="text-3xl font-extrabold text-white">
      {{ getTitle(currentTab) }}
    </h1>

    <br />

    <ProfileSettings v-if="currentTab === 'profile'" />
    <SecuritySettings v-if="currentTab === 'security'" />
    <BlockedUsersSettings v-if="currentTab === 'blocked'" />
  </div>
</template>

<script setup>
import ProfileSettings from './sections/ProfileSettings.vue';
import SecuritySettings from './sections/SecuritySettings.vue';

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
    default:
      return 'Settings';
  }
};
</script>