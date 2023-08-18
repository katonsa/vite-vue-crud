<template>
  <div id="app" class="bg-gray-100 min-h-screen p-4">
    <div class="max-w-screen-sm mx-auto bg-white rounded-lg shadow-lg p-4">
      <nav class="flex space-x-4 mb-4">
        <router-link to="/" class="text-blue-500 hover:underline">Home</router-link>
        <router-link to="/add-member" class="text-blue-500 hover:underline">Add Member</router-link>
        <router-link to="/populate-data" class="text-blue-500 hover:underline">Populate Data</router-link>
      </nav>
      <router-view></router-view>
    </div>
  </div>
</template>
