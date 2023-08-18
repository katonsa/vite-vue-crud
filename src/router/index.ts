// router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import Main from '../Main.vue';
import AddUser from '../AddUser.vue';

const routes: RouteRecordRaw[] = [
  { path: '/', component: Main },
  { path: '/add-user', component: AddUser },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
