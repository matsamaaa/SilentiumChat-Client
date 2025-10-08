<template>
    <div class="mt-8 pt-4 border-t border-gray-700 flex justify-end">
        <button
            @click="$emit('saved')"
            class="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-xl hover:bg-green-500 transition duration-150"
        >
            Save Changes
        </button>
    </div>
</template>
