<template>
    <div class="flex flex-row w-full h-full">
        <ServerChannelsWidget />
        <ServerChannelWidget class="flex-1" />
        <ServerUsersWidget />
    </div>
</template>

<script setup>
import ServerChannelsWidget from '~/components/features/server/ServerChannelsWidget.vue';
import ServerChannelWidget from '~/components/features/server/ServerChannelWidget.vue';
import ServerUsersWidget from '~/components/features/server/ServerUsersWidget.vue';
</script>