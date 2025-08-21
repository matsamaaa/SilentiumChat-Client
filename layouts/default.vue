<template>
    <div class="min-h-screen flex flex-col bg-gray-900 text-white">
        <!-- Header -->
        <header class="bg-blue-600 p-4">
            <h1 class="text-xl font-bold">SilentiumChat</h1>
        </header>

        <!-- Contenu principal -->
        <main class="flex-1 overflow-y-auto">
            <slot />
        </main>
    </div>
</template>