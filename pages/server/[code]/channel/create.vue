<template>
    <div class="flex flex-row w-full h-full">
        <ServerChannelsWidget />
        <ServerChannelCreationWidget class="flex-1" />
    </div>
</template>

<script setup>
import ServerChannelCreationWidget from '~/components/features/server/creation/ServerChannelCreationWidget.vue';
import ServerChannelsWidget from '~/components/features/server/ServerChannelsWidget.vue';
</script>