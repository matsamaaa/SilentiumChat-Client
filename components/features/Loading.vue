<template>
    <div role="status" class="flex flex-col items-center justify-center">
        
        <div class="flex items-center justify-center space-x-4">
            
            <LoadingIcon />
        
            <span class="text-xl font-medium text-gray-100">
                Loading, please wait...
            </span>
        </div>
        
        <span class="sr-only">Loading...</span>
        
    </div>
</template>

<script setup>
import LoadingIcon from '../ui/icons/LoadingIcon.vue';
</script>