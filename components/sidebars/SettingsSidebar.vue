<template>
  <nav class="flex flex-col justify-between items-start mx-2 pt-5 gap-5 h-full mb-5">
    <div class="flex flex-col justify-center w-full gap-3">
      <button 
        v-for="tab in tabs"
        :key="tab.id"
        class="w-full flex px-3 py-2 rounded-md text-white focus:outline-none duration-200"
        :class="{
          'bg-indigo-600 hover:bg-indigo-500': props.activeTab === tab.id, /* Si ACTIF */
          'bg-gray-800 hover:bg-gray-700': props.activeTab !== tab.id              /* Si INACTIF */
        }"
        @click="$emit('changeTab', tab.id)"
      >
        {{ tab.label }}
      </button>
    </div>
    <LogoutButton />
  </nav>
</template>

<script setup>
import LogoutButton from '~/components/buttons/LogoutButton.vue';

const props = defineProps({
  activeTab: {
    type: String,
    required: true
  }
});

defineEmits(['changeTab']);

const tabs = [
  { id: 'profile', label: 'Profile' }, 
  { id: 'security', label: 'Sécurity & Connexion' },
  { id: 'data', label: 'Data & Privacy' },
];
</script>