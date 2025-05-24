import LayoutUser from '../components/user/Layout/LayoutUser.vue'
import WelcomePage from '../pages/WelcomePage.vue'
import Signup from '../pages/user/Signup.vue'
import Login from '../pages/user/Login.vue'
import { isAuthenticated } from './guards'
import Home from '../components/user/Layout/Home.vue'
import AdminLogin from '../pages/admin/auth/Login.vue'
import FullScreenLayout from '../components/admin/layout/FullScreenLayout.vue'

const routes = [
   {
      path: '/',
      component: WelcomePage,
   },
   {
      path: '/user',
      component: LayoutUser,
      children: [
         {
            path: '',
            name: 'home',
            component: Home,
            meta: { requiresAuth: true },
         },
         {
            path: 'login',
            name: 'login',
            component: Login,
            beforeEnter: (to, from, next) => {
               // If user is already authenticated, redirect to /user
               if (isAuthenticated()) {
                  next('/user')
               } else {
                  next()
               }
            }
         },
         {
            path: 'signup',
            name: 'signup',
            component: Signup,
            beforeEnter: (to, from, next) => {
               // If user is already authenticated, redirect to /user
               if (isAuthenticated()) {
                  next('/user')
               } else {
                  next()
               }
            }
         },
      ]
   },
   {
      path: '/admin',
      component: FullScreenLayout
   },
   {
      path: '/admin/login',
      component: AdminLogin,
      beforeEnter: (to, from, next) => {
         // If user is already authenticated, redirect to /user
         if (isAuthenticated()) {
            next('/admin')
         } else {
            next()
         }
      }
   }
]

export default routes