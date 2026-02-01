<template>
    <div class="flex flex-row">
        <DiscussionsWidget />
        <UpdateEmailVerificationWidget />
    </div>
</template>

<script setup>
import DiscussionsWidget from '~/components/features/DiscussionsWidget.vue';
import UpdateEmailVerificationWidget from '~/components/features/verification/UpdateEmailVerificationWidget.vue';
</script>