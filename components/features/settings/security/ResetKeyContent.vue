<template>
    <div>
        <h3 class="text-xl font-semibold text-gray-100 border-b border-gray-700 pb-2">Reset Encryption Keys</h3>
        <p class="text-gray-500 text-sm  py-2">Resetting your encryption keys will invalidate your current keys and generate new ones. Make sure to back up any important data before proceeding.</p>

        <NormalButton label="Reset Encryption Keys" icon="fa-lock" @execute="handleResetKeys" />
    </div>
</template>

<script setup>
import NormalButton from '~/components/ui/buttons/NormalButton.vue';

const handleResetKeys = () => {
    // Logic to reset encryption keys goes here
    console.log('Reset Encryption Keys button clicked');
};
</script>