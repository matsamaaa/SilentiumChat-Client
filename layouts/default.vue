<template>
    <div class="min-h-screen flex flex-col bg-gray-50 text-gray-900">
        <!-- Header commun -->
        <header class="bg-blue-600 text-white p-4">
            <h1 class="text-xl font-bold">SilentiumChat</h1>
        </header>

        <!-- Contenu des pages -->
        <main class="flex-1 p-6">
            <slot />
        </main>
    </div>
</template>