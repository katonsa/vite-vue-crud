<template>
  <div>
    <div class="border rounded-lg p-4">
      <div class="mt-4">
        <input
          type="text"
          v-model="searchInput"
          placeholder="Search by name or initials..."
          class="px-2 py-1 w-full border rounded focus:outline-none focus:border-blue-500"
        />
        <select v-if="showInitialsDropdown" v-model="selectedInitial" class="mt-2 px-2 py-1 w-full border rounded focus:outline-none focus:border-blue-500">
          <option value="">Select Initial</option>
          <option v-for="initial in initials" :key="initial" :value="initial">{{ initial.toUpperCase() }}</option>
        </select>
      </div>
    </div>
    <div class="mt-8">
      <div class="flex justify-center">
        <p> <router-link to="/export" class="text-blue-500 hover:underline">Export data untuk migrasi</router-link></p>
      </div>
      <template v-if="Object.keys(groupedData).length > 0">
        <div v-for="(group, initial) in groupedData" :key="initial">
          <h2 class="text-lg font-semibold mt-6">{{ initial }}</h2>
          <div v-for="item in group" :key="item.id" class="border-b p-4 mb-4 flex justify-between">
            <div>
              <h3 class="text-lg font-semibold">{{ item.name }}</h3>
              <span :class="item.remainingDays! < 1 ? 'text-red-500 font-bold' : ''">
                  ({{ item.remainingDays! < 1 ? 'Expired' : item.remainingDays + ' days left' }})
                </span>
              <p class="text-gray-600">Joined: {{ item.joined_at }}</p>
              <p class="text-gray-600">
                Expired: {{ item.expired_at }}
              </p>
            </div>
            <!-- Buttons container -->
            <div class="flex items-center">
              <a v-if="item.phone_number" :href="'tel:' + item.phone_number" class="mr-2">
                <button class="px-2 py-1 border rounded focus:outline-none focus:border-blue-500 text-blue-500">
                  <i class="fas fa-phone"></i>
                </button>
              </a>
              <a :href="getWhatsAppLink(item.phone_number)" target="_blank" class="mr-2">
                <button class="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600 focus:outline-none">
                  <i class="fab fa-whatsapp"></i>
                </button>
              </a>
              <button @click="handleRemove(item.id!)" class="px-2 py-1 border rounded focus:outline-none focus:border-red-500 text-red-500">
                <i class="far fa-trash-alt"></i>
              </button>
            </div>
          </div>
        </div>
    </template>
      <template v-else>
        <div class="border-b p-4 mb-4">
          No members to display.
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MemberData } from './types';
import { db } from './utils/db';
import { ref, onMounted, computed, watch } from 'vue';

const searchInput = ref('');
const selectedInitial = ref('');
const selectedInitialAfterDelete = ref('');

const allData = ref<MemberData[]>([]);

const fetchData = async () => {
  allData.value = await db.table('members').toArray();

  // Calculate remaining days for each member
  const currentDate = new Date();
  allData.value.forEach(member => {
    const expiredDate = new Date(member.expired_at);
    const timeDifference = expiredDate.getTime() - currentDate.getTime();
    const remainingDays = Math.ceil(timeDifference / (1000 * 3600 * 24));
    member.remainingDays = remainingDays;
  });
};

onMounted(() => {
  fetchData();
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

const groupedData = computed(() => {
  const groups: Record<string, MemberData[]> = {};
  
  filteredData.value.forEach(member => {
    const initial = member.name.charAt(0).toUpperCase();
    if (!groups[initial]) {
      groups[initial] = [];
    }
    groups[initial].push(member);
  });
  // return groups;

  // Sort the keys (initials) alphabetically
  const sortedKeys = Object.keys(groups).sort();

  // Create a new object with sorted keys
  const sortedGroups: Record<string, MemberData[]> = {};
  sortedKeys.forEach(key => {
    sortedGroups[key] = groups[key];
  });

  return sortedGroups;
});

const initials = computed<string[]>(() => {
  const uniqueInitials = new Set(allData.value.map(item => item.name.charAt(0).toLowerCase()));
  const sortedInitials = Array.from(uniqueInitials).sort();
  return sortedInitials;
});

const filteredData = computed<MemberData[]>(() => {
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

const handleRemove = async (id: number) => {
  if (window.confirm('Are you sure you want to remove this item?')) {
    await db.table('members').delete(id);
    fetchData();
  }
};

// ChatGPT solution to handle large dataset?
// Keep a map of member IDs and their corresponding indexes in the allData array
// const memberIdToIndexMap = new Map<number, number>();

// // Populate the map with initial data
// allData.value.forEach((member, index) => {
//   memberIdToIndexMap.set(member.id!, index);
// });

// const handleRemove = async (id: number) => {
//   if (window.confirm('Are you sure you want to remove this item?')) {
//     await db.table('members').delete(id);

//     // Update the allData array without fetching everything
//     const indexToRemove = memberIdToIndexMap.get(id);
//     if (indexToRemove !== undefined) {
//       // allData.value.splice(indexToRemove, 1);
//       // memberIdToIndexMap.delete(id);
//       const updatedData = allData.value.filter(member => member.id !== id);
//       allData.value = updatedData;
//       memberIdToIndexMap.delete(id);
//     }

//     // Update remaining days for other members
//     const currentDate = new Date();
//     allData.value.forEach(member => {
//       if (member.id !== id) {
//         const expiredDate = new Date(member.expired_at);
//         const timeDifference = expiredDate.getTime() - currentDate.getTime();
//         const remainingDays = Math.ceil(timeDifference / (1000 * 3600 * 24));
//         member.remainingDays = remainingDays;
//       }
//     });
//   }
// };

const getWhatsAppLink = (phoneNumber: string) => {
  const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');
  return `https://wa.me/${cleanedPhoneNumber}`;
};
</script>
