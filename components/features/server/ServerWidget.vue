<template>
    <div class="flex-1 h-full flex items-center justify-center">
        <div class="flex flex-row items-center justify-center gap-3">
            <SquareIconButton
                :img-src="server?.icon"
                img-alt="Server Icon"
                icon="fa-solid fa-server"
                />
                <h2 class="text-white text-3xl font-bold">{{ server?.name }}</h2>
        </div>

        <h3 class="text-white text-xl mt-4">{{ server?.description }}</h3>
    </div>
</template>

<script setup>
import { useServersStore } from '#imports';
import SquareIconButton from '~/components/ui/buttons/SquareIconButton.vue';

const serversStore = useServersStore();

const route = useRoute();
const code = route.params.code;

const server = computed(() => {
    return serversStore.getServerByCode(code);
});
</script>