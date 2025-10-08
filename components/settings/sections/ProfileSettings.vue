<template>
  <section class="bg-gray-800 p-6 rounded-xl shadow-xl space-y-8">
    
    <div>
      <h2 class="text-xl font-semibold text-gray-100 mb-4 border-b border-gray-700 pb-2">Photo de Profil</h2>
      
      <div class="flex items-center space-x-6">
        <div class="text-4xl font-bold rounded-full w-24 h-24 flex items-center justify-center bg-indigo-500 text-white border-4 border-indigo-400">
           J
        </div>
        
        <div class="flex flex-col space-y-2">
          <button class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition duration-150 shadow-md">
            Changer la Photo
          </button>
          <button class="px-4 py-2 bg-gray-700 text-red-400 border border-red-600 rounded-lg hover:bg-gray-600 transition duration-150">
            Supprimer
          </button>
        </div>
      </div>
    </div>

    <hr class="border-gray-700">

    <div>
      <h2 class="text-xl font-semibold text-gray-100 mb-4 border-b border-gray-700 pb-2">Nom d'Utilisateur</h2>
      
      <div class="space-y-4">
          <label for="username" class="block text-sm font-medium text-gray-300">Nouveau pseudo et Tag</label>

          <div class="flex items-center w-full sm:w-96 border border-gray-600 bg-gray-900 rounded-md shadow-sm focus-within:ring-indigo-500 focus-within:border-indigo-500 focus-within:ring-1">
              
              <input 
                  type="text" 
                  id="username" 
                  v-model="useUserStore().user.username"
                  placeholder="Entrez votre nouveau nom d'utilisateur"
                  class="block flex-1 px-3 py-2 bg-gray-900 text-white focus:outline-none sm:text-sm rounded-l-md rounded-r-none"
              >
                <span class="text-gray-400 px-2">#</span>

              <input 
                  v-model="tag" 
                  type="text" 
                  placeholder="0000" 
                  maxlength="5"
                  @input="formatTag"
                  required 
                  class="w-16 px-2 py-2 text-center bg-gray-700 text-gray-300 font-mono focus:outline-none sm:text-sm rounded-l-none rounded-r-md"
              />
          </div>
          <p class="text-xs text-gray-400">
              Votre pseudo est visible par tous les autres utilisateurs. Le Tag est un identifiant unique à quatre chiffres.
          </p>
      </div>
    </div>
    
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';

const tag = ref(useUserStore().user.tag.toString().padStart(4, '0') || '');

const formatTag = () => {
    tag.value = tag.value.replace(/\D/g, "");

    if (tag.value.split('').length > 4) {
        tag.value = tag.value.slice(-4);
    }
}
</script>