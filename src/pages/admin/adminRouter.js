// src/pages/admin/adminRouter.js
import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from './Dashboard.vue'
import Users from './Users.vue'
import Settings from './Settings.vue'

const adminRoutes = [
  {
    path: '',
    component: Dashboard
  },
  {
    path: 'users',
    component: Users
  },
  {
    path: 'settings',
    component: Settings
  }
]

const adminRouter = createRouter({
  history: createWebHistory(),
  routes: adminRoutes
})

export default adminRouter