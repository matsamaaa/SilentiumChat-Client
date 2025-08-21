<template>
    <div class="text-center mt-20">
        <h1 class="text-5xl font-bold">{{ code }}</h1>
        <p class="mt-4 text-xl">{{ message }}</p>
    </div>
</template>

<script setup>
const route = useRoute()

// Récupérer le code depuis l'URL
const code = route.params.code

// Récupérer le message depuis les query params ou fallback
const message = route.query.message || 'Une erreur est survenue'
</script>
