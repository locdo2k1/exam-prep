import LayoutUser from '../components/user/LayoutUser.vue'
import WelcomePage from '../components/WelcomePage.vue'
import Signup from '../pages/user/Signup.vue'
import Login from '../pages/user/Login.vue'
import { isAuthenticated } from './guards'
import Home from '../components/user/Home.vue'

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
   }
]

export default routes