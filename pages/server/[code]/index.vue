<template>
    <ServerUsersSlide>
        <ServerChannelsWidget />
        <ServerWidget v-if="!deviceStore.isMobile" />
    </ServerUsersSlide>
</template>

<script setup>
import ServerChannelsWidget from '~/components/features/server/ServerChannelsWidget.vue';
import ServerWidget from '~/components/features/server/ServerWidget.vue';
import ServerUsersSlide from '~/components/features/server/ServerUsersSlide.vue';

import { useDeviceStore } from '#imports';

const deviceStore = useDeviceStore();
</script>