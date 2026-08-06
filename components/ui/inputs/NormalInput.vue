<template>
    <div class="w-full relative">
        <input
            v-bind="$attrs"
            :type="inputType"
            :value="modelValue ?? ''"
            :placeholder="placeholder"
            :autocomplete="autocomplete"
            :required="required"
            :maxlength="maxlength"
            :minlength="minLength"
            class="block w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            :class="{ 'pr-10': type === 'password' }"
            @input="onInput"
        >

        <button
            v-if="type === 'password'"
            type="button"
            tabindex="-1"
            @click="showPassword = !showPassword"
            class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-200"
        >
            <FontAwesomeIcon :icon="showPassword ? 'eye-slash' : 'eye'" />
        </button>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

defineOptions({ inheritAttrs: false });

const props = defineProps({
    modelValue: {
        type: [String, Number, null],
        default: null
    },
    type: {
        type: String,
        default: 'text'
    },
    placeholder: {
        type: String,
        default: ''
    }, 
    autocomplete: {
        type: String,
        default: 'off'
    },
    required: {
        type: Boolean,
        default: false
    },
    maxlength: {
        type: [String, Number],
        default: null
    },
    minLength: {
        type: [String, Number],
        default: null
    }
});

const emit = defineEmits(['update:modelValue']);

const onInput = (event) => {
    emit('update:modelValue', event.target.value);
};

const showPassword = ref(false);

const inputType = computed(() => {
    if (props.type === 'password') {
        return showPassword.value ? 'text' : 'password';
    }
    return props.type;
});
</script>