<template>
    <div class="h-full">
        <section class="bg-gray-800 p-6 rounded-xl shadow-xl space-y-8">
        
            <div>
                <h2 class="text-xl font-semibold text-gray-100 mb-4 border-b border-gray-700 pb-2">Security Settings</h2>
                <p class="text-sm text-gray-500">Manage your account's security and privacy settings.</p>
            </div>

            <UpdateMailContent />

            <hr class="border-gray-700">

            <UpdatePasswordContent />

            <hr class="border-gray-700">

            <RevealPrivateKeyContent />

            <hr class="border-gray-700">

            <ResetKeyContent />

            <hr class="border-gray-700">

            <ImportKeyContent />

        </section>

        <br><br>
    </div>
</template>

<script setup>
import ResetKeyContent from '~/components/features/settings/security/ResetKeyContent.vue';
import RevealPrivateKeyContent from '~/components/features/settings/security/RevealPrivateKeyContent.vue';
import UpdateMailContent from '~/components/features/settings/security/UpdateMailContent.vue';
import UpdatePasswordContent from '~/components/features/settings/security/UpdatePasswordContent.vue';
import ImportKeyContent from '~/components/features/settings/security/ImportKeyContent.vue';
</script>