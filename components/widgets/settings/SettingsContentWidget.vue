<template>
  <div class="h-full overflow-y-scroll scrollbar-hide">
    <h1 class="text-3xl font-extrabold text-white">
      {{ getTitle(currentTab) }}
    </h1>

    <br />

    <ProfileWidget v-if="currentTab === 'profile'" />
    <SecurityWidget v-if="currentTab === 'security'" />
    <DataWidget v-if="currentTab === 'data'" />
  </div>
</template>

<script setup>
import DataWidget from './DataWidget.vue';
import ProfileWidget from './ProfileWidget.vue';
import SecurityWidget from './SecurityWidget.vue';

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