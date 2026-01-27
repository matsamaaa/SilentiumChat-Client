<template>
    <div>
        <section class="bg-gray-800 p-6 h-full rounded-xl shadow-xl space-y-8">
            <div>
                <h2 class="text-xl font-semibold text-gray-100 mb-4 border-b border-gray-700 pb-2">Fake Password</h2>
                <p class="text-sm text-gray-500">Set up a fake password to delete your data.</p>
            </div>

            <SetupFakePassword  />
        </section>
    </div>
</template>

<script setup>
import SetupFakePassword from '../others/data/SetupFakePassword.vue';


</script>