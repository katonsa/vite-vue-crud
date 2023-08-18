<template>
  <div class="">
    <div class="max-w-screen-sm mx-auto bg-white rounded-lg shadow-lg p-4">
      <div class="mt-4">
        <input
          type="text"
          v-model="searchInput"
          placeholder="Search by name or initials..."
          class="px-2 py-1 w-full border rounded focus:outline-none focus:border-blue-500"
        />
        <select v-if="showInitialsDropdown" v-model="selectedInitial" class="mt-2 px-2 py-1 w-full border rounded focus:outline-none focus:border-blue-500">
          <option value="">Select Initial</option>
          <option v-for="initial in initials" :key="initial" :value="initial">{{ initial }}</option>
        </select>
      </div>
    </div>
    <div class="mt-8">
      <template v-if="filteredData.length > 0">
        <div
          v-for="item in filteredData"
          :key="item.id"
          class="bg-white rounded-lg shadow p-4 mb-4"
        >
          <h3 class="text-lg font-semibold">{{ item.name }}</h3>
          <p class="text-gray-600">Phone: {{ item.phone_number }}</p>
          <p class="text-gray-600">Address: {{ item.address }}</p>
          <p class="text-gray-600">Joined: {{ item.joined_at }}</p>
          <p class="text-gray-600">Expired: {{ item.expired_at }}</p>
          <button
            @click="removeData(item.id)"
            class="mt-2 px-2 py-1 border rounded focus:outline-none focus:border-red-500 text-red-500"
          >
            Remove
          </button>
        </div>
      </template>
      <template v-else>
        <div class="bg-white rounded-lg shadow p-4 mb-4">
          No users to display.
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { db } from './utils/db';
import { ref, onMounted, computed, watch } from 'vue';

// Define the type for your data objects
interface CsvData {
  id: number;
  name: string;
  phone_number: string;
  address: string;
  joined_at: string;
  expired_at: string;
}

const searchInput = ref('');
const selectedInitial = ref('');
const selectedInitialAfterDelete = ref('');

const allData = ref<CsvData[]>([]); // Initialize as an empty array

const fetchData = async () => {
  allData.value = await db.table('members').toArray();
};

onMounted(() => {
  fetchData(); // Fetch data when the component mounts
});

const showInitialsDropdown = computed<boolean>(() => {
  return searchInput.value.length === 0;
});

watch(allData, () => {
  if (!initials.value.includes(selectedInitial.value)) {
    selectedInitial.value = '';
  }
  selectedInitialAfterDelete.value = selectedInitial.value;
});

const initials = computed<string[]>(() => {
  const uniqueInitials = new Set(allData.value.map(item => item.name.charAt(0).toLowerCase()));
  return Array.from(uniqueInitials);
});

const filteredData = computed<CsvData[]>(() => {
  const searchText = searchInput.value.toLowerCase().trim();
  if (searchText === '') {
    if (selectedInitial.value) {
      return allData.value.filter(item =>
        item.name.toLowerCase().startsWith(selectedInitial.value)
      );
    } else {
      return allData.value;
    }
  } else {
    return allData.value.filter(item =>
      item.name.toLowerCase().includes(searchText)
    );
  }
});

const removeData = async (id: number) => {
  await db.table('members').delete(id);
  fetchData(); // Fetch data again after deleting
};
</script>

<style>
/* No need to use scoped styles with Tailwind CSS */
</style>

