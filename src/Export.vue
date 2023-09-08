<template>
  <div class="flex flex-col items-left">
    <h2 class="text-lg font-semibold mb-4">Export Data</h2>
    <p>File .csv akan didownload</p>
    <button @click="exportAndSave" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
        Export and save
      </button>
  </div>
</template>

<script setup lang="ts">
import { db } from './utils/db';

const exportAndSave = async () => {
  const members = await db.table('members').toArray();
  const beforeExported = [];

  for (const member of members) {
    let typeId = 0

    if (member.membership_type === '30') {
      typeId = 1
    } else if (member.membership_type === '60') {
      typeId = 2
    } else if (member.membership_type === '360') {
      typeId = 3
    }

    beforeExported.push({
      ...member,
      id: undefined,
      membership_type: undefined,
      membershipTypeId: typeId,
    })
  }

  const csvData = convertObjectToCSV(JSON.parse(JSON.stringify(beforeExported)));

  const blob = new Blob([csvData], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'output.csv';
  document.body.appendChild(a);
  a.click();

  window.URL.revokeObjectURL(url);
}

function convertObjectToCSV(data: any[]) {
  const header = Object.keys(data[0]).join(',') + '\n';
  const csvData = data.map((item: { [s: string]: unknown; } | ArrayLike<unknown>) => Object.values(item).join(',')).join('\n');
  return header + csvData;
}
</script>
