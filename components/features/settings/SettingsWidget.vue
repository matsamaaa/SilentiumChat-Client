<template>
  <div class="h-full overflow-y-scroll scrollbar-hide">
    <h1 class="text-3xl font-extrabold text-white">
      {{ getTitle(currentTab) }}
    </h1>

    <br />

    <ProfileContent v-if="currentTab === 'profile'" />
    <SecurityContent v-if="currentTab === 'security'" />
    <DataContent v-if="currentTab === 'data'" />
  </div>
</template>

<script setup>
import SecurityContent from '~/components/features/settings/security/SecurityContent.vue';
import DataContent from '~/components/features/settings/data/DataContent.vue';
import ProfileContent from '~/components/features/settings/profile/ProfileContent.vue';

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
    case 'data':
      return 'Data and Privacy Settings';
    default:
      return 'Settings';
  }
};
</script>