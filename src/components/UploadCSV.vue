<template>
  <div class="flex flex-col items-left">
    <h2 class="text-lg font-semibold mb-4">Populate Data</h2>
    <div class="mb-2">
      <h4 class="text-md font-semibold mb-2">Upload .csv file</h4>
      <p>name,phone_number,address,joined_at,expired_at</p>
      <input type="file" ref="fileInput" id="fileInput" accept=".csv" class="mb-2" />
      <button @click="parseAndSave" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
        Parse and Save
      </button>
    </div>
    <div class="mb-2">
      <h4 class="text-md font-semibold mb-2">Generate random data</h4>
      <button @click="generateRandomData" class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
        Generate
      </button>
      <button @click="confirmClearDatabase" class="bg-red-500 text-white py-2 px-4 rounded ml-2 hover:bg-red-600">
      Clear Database
    </button>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue';
// @ts-ignore
import Papa from 'papaparse';
import { db, addMember, clearDatabase } from '../utils/db';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const fileInputRef = ref<HTMLInputElement | null>(null);

onMounted(() => {
  fileInputRef.value = document.querySelector('#fileInput');
});

const parseAndSave = () => {
  const fileInput = fileInputRef.value;

  if (fileInput && fileInput.files && fileInput.files.length > 0) {
    const file = fileInput.files[0];

    Papa.parse(file, {
      complete: (result: any) => {
        const headers = result.data[0];
        const data = result.data.slice(1);

        if (headers.length === 5) {
          data.forEach((row: any) => {
            if (row.some((value: any) => value.trim() !== '')) {
              const rowData: Record<string, any> = {
                // id: row[0],
                name: row[0],
                phone_number: row[1],
                address: row[2],
                joined_at: row[3],
                expired_at: row[4],
              };

              db.table('members').add(rowData);
            }
          });

          router.push('/')
        } else {
          console.error('CSV file does not have the expected number of columns');
        }
      },
    });
  } else {
    console.error('No file selected');
  }
};

const generateRandomData = async () => {
  const membershipTypeOptions = ['30', '60', '365'];

  for (let i = 0; i < 10; i++) {
    const randomName = generateRandomName();
    const randomPhoneNumber = generateRandomPhoneNumber();
    const randomAddress = generateRandomAddress();
    const randomMembershipType = membershipTypeOptions[Math.floor(Math.random() * membershipTypeOptions.length)];
    
    const newMember = {
      name: randomName,
      phone_number: randomPhoneNumber,
      address: randomAddress,
      joined_at: new Date().toISOString().substr(0, 10),
      expired_at: calculateExpirationDate(new Date(), randomMembershipType),
      membership_type: randomMembershipType
    };

    await addMember(newMember);
  }

  alert('Generated 10 random data entries with Indonesian theme.');
};

const generateRandomName = () => {
  const firstNames = ['Putra', 'Dewi', 'Budi', 'Siti', 'Surya', 'Laras', 'Agung', 'Rina', 'Rizki', 'Anita', 'Indra', 'Eka', 'Ayu', 'Adi', 'Sinta', 'Mega', 'Fajar', 'Wulan', 'Joko', 'Rini'];
  const lastNames = ['Santoso', 'Wijaya', 'Kusuma', 'Wati', 'Hidayat', 'Wulandari', 'Prabowo', 'Sari', 'Nugroho', 'Mulyani', 'Saputra', 'Purnama', 'Yulianto', 'Nugraha', 'Setiawan', 'Gunawan', 'Kurniawan', 'Sulistyo', 'Pangestu', 'Widodo'];
  
  const randomFirstNameIndex = Math.floor(Math.random() * firstNames.length);
  const randomLastNameIndex = Math.floor(Math.random() * lastNames.length);
  
  const randomFirstName = firstNames[randomFirstNameIndex];
  const randomLastName = lastNames[randomLastNameIndex];
  
  return `${randomFirstName} ${randomLastName}`;
};

const generateRandomPhoneNumber = () => {
  const randomNumber = Math.floor(Math.random() * 900000000) + 100000000;
  return `08${randomNumber}`;
};

const generateRandomAddress = () => {
  const streets = ['Jl. Merdeka', 'Jl. Raya', 'Jl. Jenderal Sudirman', 'Jl. Diponegoro', 'Jl. Gajah Mada'];
  const cities = ['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Bali'];
  const randomStreetIndex = Math.floor(Math.random() * streets.length);
  const randomCityIndex = Math.floor(Math.random() * cities.length);
  return `${streets[randomStreetIndex]}, ${cities[randomCityIndex]}`;
};

const calculateExpirationDate = (startDate: Date, membershipType: string) => {
  const expirationDate = new Date(startDate);
  expirationDate.setDate(expirationDate.getDate() + parseInt(membershipType));
  return expirationDate.toISOString().substr(0, 10);
};

const confirmClearDatabase = () => {
  const confirmation = confirm('Are you sure you want to clear the entire database? This action cannot be undone.');

  if (confirmation) {
    clearDatabase();
    alert('Cleared the entire database.');
  }
};

</script>
