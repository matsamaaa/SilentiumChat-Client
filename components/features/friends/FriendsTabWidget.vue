<template>
    <div class="flex flex-col gap-4 my-5 mx-2 w-full">
        <div class="flex flex-row gap-4">
            <NormalButton
                type="button"
                @execute="updateTab('accepted')"
                label="Friends"
                :bgSelect="['accepted'].includes(tab)"
                icon="user"
                />

            <NormalButton
                type="button"
                @execute="updateTab('pending')"
                label="Pending"
                :bgSelect="['pending'].includes(tab)"
                icon="user-clock"
                />

            <NormalButton
                type="button"
                @execute="updateTab('blocked')"
                label="Blocked"
                :bgSelect="['blocked'].includes(tab)"
                icon="user-lock"
                />
        </div>

        <FriendsListContent 
            :tab="tab" 
            />
    </div>
</template>

<script setup>
import NormalButton from '~/components/ui/buttons/NormalButton.vue';
import FriendsListContent from '~/components/features/friends/FriendsListContent.vue';

const tab = ref('accepted');

const updateTab = (newTab) => {
    tab.value = newTab;
};
</script>