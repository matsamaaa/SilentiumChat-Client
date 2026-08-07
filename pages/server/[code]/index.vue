<template>
    <ServerUsersSlide>
        <ServerChannelsWidget @settings-click="handleServerSettings" />
        <ServerWidget v-if="!deviceStore.isMobile" />
        <ServerUpdateWidget v-if="settingsClicked" @close="handleServerSettings" />
    </ServerUsersSlide>
</template>

<script setup>
import ServerChannelsWidget from '~/components/features/server/ServerChannelsWidget.vue';
import ServerWidget from '~/components/features/server/ServerWidget.vue';
import ServerUsersSlide from '~/components/features/server/ServerUsersSlide.vue';
import ServerUpdateWidget from '~/components/features/server/ServerUpdateWidget.vue';

import { useDeviceStore } from '#imports';

const deviceStore = useDeviceStore();

const settingsClicked = ref(false);

const handleServerSettings = () => {
    settingsClicked.value = !settingsClicked.value;
}
</script>