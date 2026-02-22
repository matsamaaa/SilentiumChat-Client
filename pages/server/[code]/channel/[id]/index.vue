<template>
    <ServerUsersSlide>
        <ServerChannelsWidget />
        <ServerChannelWidget class="flex-1" />
    </ServerUsersSlide>
</template>

<script setup>
import ServerChannelsWidget from '~/components/features/server/ServerChannelsWidget.vue';
import ServerChannelWidget from '~/components/features/server/ServerChannelWidget.vue';
import ServerUsersSlide from '~/components/features/server/ServerUsersSlide.vue';
</script>