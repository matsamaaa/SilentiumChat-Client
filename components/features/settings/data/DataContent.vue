<template>
    <div class="h-full">
        <section class="bg-gray-800 p-6 rounded-xl shadow-xl space-y-8">
        
            <div>
                <h2 class="text-xl font-semibold text-gray-100 mb-4 border-b border-gray-700 pb-2">Datas & Privacy Settings</h2>
                <p class="text-sm text-gray-500">Manage your data and privacy preferences.</p>
            </div>

            <UpdateFakePasswordContent />

            <hr class="border-gray-700">

            <DeleteDatasContent />

        </section>
    </div>
</template>

<script setup>
import UpdateFakePasswordContent from './UpdateFakePasswordContent.vue';
import DeleteDatasContent from './DeleteDatasContent.vue';
</script>