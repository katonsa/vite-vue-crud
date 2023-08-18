<template>
  <div>
    <input type="file" ref="fileInput" id="fileInput" accept=".csv" />
    <button @click="parseAndSave">Parse and Save</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
// @ts-ignore
import Papa from 'papaparse';
import { db } from '../utils/db';

const fileInputRef = ref<HTMLInputElement | null>(null);

const parseAndSave = () => {
  const fileInput = fileInputRef.value;

  if (fileInput && fileInput.files && fileInput.files.length > 0) {
    const file = fileInput.files[0];

    Papa.parse(file, {
      complete: (result: any) => {
        const headers = result.data[0];
        const data = result.data.slice(1);

        if (headers.length === 6) {
          data.forEach((row: any) => {
            if (row.some((value: any) => value.trim() !== '')) {
              const rowData: Record<string, any> = {
                // id: row[0],
                name: row[1],
                phone_number: row[2],
                address: row[3],
                joined_at: row[4],
                expired_at: row[5],
              };

              db.table('members').add(rowData);
            }
          });
        } else {
          console.error('CSV file does not have the expected number of columns');
        }
      },
    });
  } else {
    console.error('No file selected');
  }
};

import { onMounted } from 'vue';
onMounted(() => {
  fileInputRef.value = document.querySelector('#fileInput'); // Make sure the actual ID matches
});
</script>
