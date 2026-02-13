<template>
    <div class="flex flex-row w-full h-full">
        <DiscussionsWidget />
        <div class="flex-1 h-full">
            <ServerCreationWidget />
        </div>
    </div>
</template>

<script setup>
import DiscussionsWidget from '~/components/features/DiscussionsWidget.vue';
import ServerCreationWidget from '~/components/features/server/creation/ServerCreationWidget.vue';
</script>