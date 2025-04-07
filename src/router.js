// src/router.js
import { createRouter, createWebHistory } from 'vue-router'
import MainPageUser from './components/user/MainPage.vue'
import WelcomePage from './components/WelcomePage.vue'
import Signup from './pages/user/Signup.vue'
import Login from './pages/user/Login.vue'

const routes = [
   // {
   //    // path: '/admin',
   //    //  component: Admin,
   //    //  children: adminRouter.options.routes
   // },
   {
      path: '/',
      component: WelcomePage,
   },
   {
      path: '/user',
      component: MainPageUser,
      children: [
         {
            path: 'login',
            name: 'login',
            component: Login
         },
         {
            path: 'signup',
            name: 'signup',
            component: Signup
         },
      ]
   }
]

const router = createRouter({
   history: createWebHistory(),
   routes
})

export default router