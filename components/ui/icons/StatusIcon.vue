<template>
    <span v-if="!props.isEditable" :class="badgeClasses">
        {{ statusLabel }}
    </span>

    <div v-else class="relative inline-block" ref="dropdownRoot">
        <button
            type="button"
            :class="dropdownButtonClasses"
            @click="toggleDropdown"
        >
            <span class="truncate">{{ statusLabel }}</span>
            <FontAwesomeIcon
                :icon="['fas', 'chevron-left']"
                class="h-3.5 w-3.5 ml-2 shrink-0 rotate-90"
            />
        </button>

        <div
            v-if="isOpen"
            class="absolute right-0 bottom-full mb-2 w-40 rounded-md border border-gray-700 bg-gray-900/95 backdrop-blur-sm shadow-lg z-50 overflow-hidden"
        >
            <button
                v-for="option in statusOptions"
                :key="option.value"
                type="button"
                class="w-full text-left px-3 py-2 text-xs font-medium flex items-center gap-2 hover:bg-gray-800/70 transition"
                :class="option.value === editableStatus ? 'bg-gray-800/50' : ''"
                @click="selectStatus(option.value)"
            >
                <span class="inline-block h-2 w-2 rounded-sm border" :class="option.dotClasses" />
                <span :class="option.textClasses">{{ option.label }}</span>
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useApiStore } from '@/stores/api';
import { useStatusStore } from '@/stores/status';
import { useWebSocketStore } from '@/stores/ws';

const props = defineProps({
    userId: {
        type: String,
        required: false
    },
    me: {
        type: Boolean,
        default: false
    },
    isEditable: {
        type: Boolean,
        default: false
    }
});

const apiStore = useApiStore();
const statusStore = useStatusStore();
const wsStore = useWebSocketStore();

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

const editableStatus = ref('online');
const isOpen = ref(false);
const dropdownRoot = ref(null);

const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
};

const closeDropdown = () => {
    isOpen.value = false;
};

const onDocumentClick = (event) => {
    if (!isOpen.value) return;
    const root = dropdownRoot.value;
    if (!root) return;
    if (root.contains(event.target)) return;
    closeDropdown();
};

onMounted(() => {
    document.addEventListener('click', onDocumentClick);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', onDocumentClick);
});

watch(
    normalizedStatus,
    (next) => {
        // keep dropdown in sync with current value (ignore offline)
        if (!props.isEditable) return;
        if (['online', 'dnd', 'idle', 'invisible'].includes(next)) {
            editableStatus.value = next;
        } else {
            editableStatus.value = 'online';
        }
    },
    { immediate: true }
);

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

const dropdownButtonClasses = computed(() => {
    return [
        'inline-flex items-center justify-center',
        'px-2 py-0.5',
        'rounded-md border',
        'text-xs font-medium leading-none',
        'focus:outline-none focus:ring-2 focus:ring-indigo-500/40',
        'cursor-pointer select-none',
        badgeVariantClasses.value
    ].join(' ');
});

const statusOptions = computed(() => {
    return [
        {
            value: 'online',
            label: 'Online',
            textClasses: 'text-green-300',
            dotClasses: 'border-green-500/60 bg-green-500/10'
        },
        {
            value: 'dnd',
            label: 'DND',
            textClasses: 'text-red-300',
            dotClasses: 'border-red-500/60 bg-red-500/10'
        },
        {
            value: 'idle',
            label: 'Idle',
            textClasses: 'text-amber-300',
            dotClasses: 'border-amber-500/60 bg-amber-500/10'
        },
        {
            value: 'invisible',
            label: 'Invisible',
            textClasses: 'text-purple-300',
            dotClasses: 'border-purple-500/60 bg-purple-500/10'
        }
    ];
});

const applyEditableStatus = async () => {
    const nextStatus = String(editableStatus.value || '').toLowerCase();
    if (!['online', 'dnd', 'idle', 'invisible'].includes(nextStatus)) return;

    if (props.me) {
        meStatus.value = nextStatus;
    }
    if (props.userId) {
        statusStore.updateStatus(props.userId, nextStatus);
    }

    wsStore.wsUpdateUserStatus(nextStatus);
};

const selectStatus = async (next) => {
    editableStatus.value = next;
    await applyEditableStatus();
    closeDropdown();
};
</script>