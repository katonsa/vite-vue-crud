<template>
  <div>
    <h2 class="text-lg font-semibold mb-4">Add Member</h2>
    <form @submit.prevent="addMemberToDatabase">
      <div class="mb-4">
        <label for="name" class="block text-gray-600">Name</label>
        <input v-model="formData.name" type="text" id="name" class="w-full border rounded px-2 py-1 focus:outline-none focus:border-blue-500" required autocomplete="off">
      </div>
      <div class="mb-4">
        <label for="phone" class="block text-gray-600">Phone Number</label>
        <input v-model="formData.phone_number" type="text" id="phone" class="w-full border rounded px-2 py-1 focus:outline-none focus:border-blue-500" required autocomplete="off">
      </div>
      <div class="mb-4">
        <label for="address" class="block text-gray-600">Address</label>
        <textarea v-model="formData.address" id="address" class="w-full border rounded px-2 py-1 focus:outline-none focus:border-blue-500"></textarea>
      </div>
      <div class="mb-4">
        <label for="membershipType" class="block text-gray-600">Membership Type</label>
        <select v-model="membershipType" id="membershipType" class="w-full border rounded px-2 py-1 focus:outline-none focus:border-blue-500">
          <option value="30">30 days</option>
          <option value="60">60 days</option>
          <option value="365">1 year</option>
        </select>
      </div>
      <div class="mb-4">
        <label for="joined" class="block text-gray-600">Joined At</label>
        <input :value="formData.joined_at" type="date" id="joined" class="border rounded px-2 py-1 focus:outline-none focus:border-blue-500">
      </div>
      <div class="mb-4">
        <label for="expired" class="block text-gray-600">Expired At</label>
        <input v-model="expirationDate" type="date" id="expired" class="border rounded px-2 py-1 focus:outline-none focus:border-blue-500">
      </div>
      <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Add User</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { addMember } from './utils/db';
import { useRouter } from 'vue-router';

const router = useRouter();

const formData = ref({
  name: '',
  phone_number: '',
  address: '',
  joined_at: new Date().toISOString().substr(0, 10),
  expired_at: '',
});

const membershipType = ref('30');

const expirationDate = computed(() => {
  const joinedDate = new Date(formData.value.joined_at);
  const type = parseInt(membershipType.value);
  if (type && !isNaN(joinedDate.getTime())) {
    const expirationDate = new Date(joinedDate.getTime() + type * 24 * 60 * 60 * 1000);
    return formatDate(expirationDate);
  }
  return '';
});

watch(membershipType, (newMembershipType) => {
  const type = parseInt(newMembershipType);
  if (type && formData.value.joined_at) {
    const joinedDate = new Date(formData.value.joined_at);
    const expirationDate = new Date(joinedDate.getTime() + type * 24 * 60 * 60 * 1000);
    formData.value.expired_at = formatDate(expirationDate);
  }
});

const addMemberToDatabase = async () => {
  try {
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
    router.push('/');
  } catch (error: any) {
    // Handle error and display error messages
    if (error.response && error.response.data && error.response.data.errors) {
      // when using fetch or xhr library
      alert(error.response.data.errors);
    } else {
      alert('An error occurred.');
    }
  }
};

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
</script>
