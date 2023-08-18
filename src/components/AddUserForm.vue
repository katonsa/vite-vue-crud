<template>
  <div>
    <h2 class="text-lg font-semibold mb-4">Add User</h2>
    <form @submit.prevent="addMemberToDatabase">
      <div class="mb-4">
        <label for="name" class="block text-gray-600">Name</label>
        <input v-model="formData.name" type="text" id="name" class="w-full border rounded px-2 py-1 focus:outline-none focus:border-blue-500" required>
      </div>
      <div class="mb-4">
        <label for="phone" class="block text-gray-600">Phone Number</label>
        <input v-model="formData.phone_number" type="text" id="phone" class="w-full border rounded px-2 py-1 focus:outline-none focus:border-blue-500">
      </div>
      <div class="mb-4">
        <label for="address" class="block text-gray-600">Address</label>
        <input v-model="formData.address" type="text" id="address" class="w-full border rounded px-2 py-1 focus:outline-none focus:border-blue-500">
      </div>
      <div class="mb-4">
        <label for="joined" class="block text-gray-600">Joined At</label>
        <input v-model="formData.joined_at" type="date" id="joined" class="border rounded px-2 py-1 focus:outline-none focus:border-blue-500">
      </div>
      <div class="mb-4">
        <label for="expired" class="block text-gray-600">Expired At</label>
        <input v-model="formData.expired_at" type="date" id="expired" class="border rounded px-2 py-1 focus:outline-none focus:border-blue-500">
      </div>
      <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Add User</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { addMember } from '../utils/db'; // Adjust the path as needed

const formData = ref({
  name: '',
  phone_number: '',
  address: '',
  joined_at: '',
  expired_at: ''
});

const addMemberToDatabase = async () => {
  // Validate form data
  if (!formData.value.name) {
    alert('Please enter a name.');
    return;
  }
  // ... (other validation)

  // Create an object with the form data
  const newMember = {
    name: formData.value.name,
    phone_number: formData.value.phone_number,
    address: formData.value.address,
    joined_at: formData.value.joined_at,
    expired_at: formData.value.expired_at
  };

  // Add member to the database
  await addMember(newMember);

  // After adding, reset form data
  formData.value.name = '';
  formData.value.phone_number = '';
  formData.value.address = '';
  formData.value.joined_at = '';
  formData.value.expired_at = '';

  alert('Member added successfully.');
};
</script>

<style scoped>
/* Add your styles here */
</style>
