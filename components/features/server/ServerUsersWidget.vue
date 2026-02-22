<template>
    <div
        :class="[
            deviceStore.isTablet ? 'w-[30vw]' : '', 
            deviceStore.isMobile ? 'w-[85vw] h-[94vh]' : 'h-full',
            deviceStore.isDesktop ? 'w-[13vw]' : ''
        ]"
        class="shadow-xl/30 bg-gray-900 flex flex-col border-r border-b border-gray-800 rounded-br-lg flex-shrink-0 border-l border-gray-800">
        <div class="h-[6vh] flex items-center justify-between px-3">
            <div class="flex flex-col leading-tight">
                <p class="text-gray-100 font-semibold text-sm">Members</p>
                <p class="text-gray-400 text-xs">
                    <span class="text-gray-300">{{ membersCount }}</span>
                    <span class="text-gray-400"> users</span>
                </p>
            </div>
        </div>

        <div class="flex-1 overflow-y-auto py-2">
            <template v-if="load">
                <p v-if="members.length === 0" class="text-gray-400 text-sm px-3 py-2">
                    No members to display.
                </p>

                <LittleProfilePlate
                    v-for="memberId in members"
                    :key="memberId"
                    :userId="String(memberId)"
                    :username="getMemberUser(memberId)?.username || 'Unknown User'"
                    :avatarIconSrc="getMemberUser(memberId)?.avatar || null"
                />
            </template>

            <template v-else>
                <div class="px-3 py-6">
                    <Loading />
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import { useDeviceStore, useServersStore, useNavigationStore, useNotificationStore, useStatusStore } from '#imports';
import LittleProfilePlate from '~/components/ui/LittleProfilePlate.vue';
import Loading from '~/components/features/Loading.vue';

const deviceStore = useDeviceStore();
const serversStore = useServersStore();
const navigationStore = useNavigationStore();
const notificationStore = useNotificationStore();
const statusStore = useStatusStore();

const route = useRoute();
const code = route.params.code;

const server = computed(() => {
    return serversStore.getServerByCode(code);
});

const members = computed(() => {
    const list = server.value?.members;
    return Array.isArray(list) ? list : [];
});

const membersCount = computed(() => members.value.length);

const getMemberUser = (memberId) => {
    return statusStore.getUserById(memberId);
};

const load = ref(false);

onMounted(async () => {
    if (!server.value) {
        notificationStore.add('error', 'Server not found');
        return navigationStore.goToHome();
    }

    await Promise.all(members.value.map(async (memberId) => {
        await statusStore.initializeStatus(memberId);
    }));
    load.value = true;
});
</script>