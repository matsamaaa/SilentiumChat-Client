<template>
    <span :class="badgeClasses">
        {{ statusLabel }}
    </span>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useApiStore } from '@/stores/api';
import { useStatusStore } from '@/stores/status';

const props = defineProps({
    userId: {
        type: String,
        required: false
    },
    me: {
        type: Boolean,
        default: false
    }
});

const apiStore = useApiStore();
const statusStore = useStatusStore();

const meStatus = ref(null);

onMounted(async () => {
    if (!props.me) return;
    try {
        meStatus.value = await apiStore.getStatus();
    } catch {
        meStatus.value = null;
    }
});

const status = computed(() => {
    if (props.me && meStatus.value) return String(meStatus.value);
    const fromStore = statusStore.getStatusByUserId(props.userId);
    if (fromStore) return String(fromStore);
    return 'offline';
});

const normalizedStatus = computed(() => String(status.value || 'offline').toLowerCase());

const statusLabel = computed(() => {
    switch (normalizedStatus.value) {
        case 'online':
            return 'Online';
        case 'offline':
            return 'Offline';
        case 'invisible':
            return 'Invisible';
        case 'dnd':
            return 'DND';
        case 'idle':
            return 'Idle';
        default:
            return String(status.value || 'Offline');
    }
});

const badgeVariantClasses = computed(() => {
    switch (normalizedStatus.value) {
        case 'online':
            return 'border-green-500/60 text-green-300 bg-green-500/10';
        case 'dnd':
            return 'border-red-500/60 text-red-300 bg-red-500/10';
        case 'idle':
            return 'border-amber-500/60 text-amber-300 bg-amber-500/10';
        case 'invisible':
            return 'border-purple-500/60 text-purple-300 bg-purple-500/10';
        case 'offline':
        default:
            return 'border-gray-600 text-gray-300 bg-gray-800/40';
    }
});

const badgeClasses = computed(() => {
    return [
        'inline-flex items-center justify-center',
        'px-2 py-0.5',
        'rounded-md border',
        'text-xs font-medium leading-none',
        badgeVariantClasses.value
    ].join(' ');
});
</script>