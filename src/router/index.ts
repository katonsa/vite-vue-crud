import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import Main from '../Main.vue';
import AddMember from '../AddMember.vue';
import PopulateData from '../PopulateData.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', component: Main },
  { path: '/add-member', component: AddMember },
  { path: '/populate-data', component: PopulateData },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
