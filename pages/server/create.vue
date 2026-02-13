<template>
    <div class="flex flex-row w-full h-full">
        <DiscussionsWidget v-if="!deviceStore.isMobile" />
        <div class="flex-1 h-full">
            <ServerCreationWidget />
        </div>
    </div>
</template>

<script setup>
import DiscussionsWidget from '~/components/features/DiscussionsWidget.vue';
import ServerCreationWidget from '~/components/features/server/creation/ServerCreationWidget.vue';

import { useDeviceStore } from '#imports';

const deviceStore = useDeviceStore();
</script>