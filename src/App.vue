<template>
  <div id="app" class="bg-gray-100 min-h-screen p-4">
    <div class="max-w-screen-sm mx-auto bg-white rounded-lg shadow-lg p-4">
      <UploadCSV />
      <router-view></router-view> <!-- Make sure this tag is here -->
    </div>
  </div>
</template>

<script setup lang="ts">
import UploadCSV from './components/UploadCSV.vue';
</script>
