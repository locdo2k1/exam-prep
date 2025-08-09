import LayoutUser from '../components/user/Layout/LayoutUser.vue'
import WelcomePage from '../pages/WelcomePage.vue'
import Signup from '../pages/user/Signup.vue'
import Login from '../pages/user/Login.vue'
import { isAuthenticated } from './guards'
import Home from '../components/user/layout/UserHome.vue'
import AdminLogin from '../pages/admin/auth/Login.vue'
import AdminLayoutWrapper from '../components/admin/layout/AdminLayoutWrapper.vue' // Changed this line
import QuestionAdminCreate from '../pages/admin/question/QuestionAdminCreate.vue'
import QuestionAdminEdit from '../pages/admin/question/QuestionAdminEdit.vue'
import QuestionAdminList from '../pages/admin/question/QuestionAdminList.vue'
import QuestionSet from '../components/question/QuestionSet.vue'
import QuestionSetList from '../pages/admin/question-set/QuestionSetList.vue'
import QuestionSetCreate from '../pages/admin/question-set/QuestionSetCreate.vue'
import QuestionSetEdit from '../pages/admin/question-set/QuestionSetEdit.vue'
import TestCreate from '../pages/admin/test/TestCreate.vue'
import TestEdit from '../pages/admin/test/TestEdit.vue';
import TestList from '../pages/admin/test/TestList.vue'
import TestPage from '../pages/user/test mode/TestPage.vue'
import ExamTest from '../pages/user/test mode/ExamTest.vue'

const routes = [
   {
      path: '/',
      component: WelcomePage,
   },

   // {
   //    path: '/test/:id/take',
   //    name: 'take-test',
   //    component: TakeTestPage,
   //    meta: { requiresAuth: true }
   // },
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
            path: 'test/:id',
            name: 'test-details',
            component: TestPage,
            meta: { requiresAuth: true }
         },
         {
            path: 'test/:id/start',
            name: 'take-test',
            component: ExamTest,
            meta: { requiresAuth: true }
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
      component: AdminLayoutWrapper,
      children: [
         // Legacy routes (keep for backward compatibility)
         {
            path: 'question-management',
            redirect: '/admin/question-bank/questions',
            meta: { requiresAuth: true },
         },
         {
            path: 'question-management/create',
            redirect: '/admin/question-bank/questions/create',
            meta: { requiresAuth: true },
         },
         {
            path: 'question-management/edit/:id',
            redirect: to => ({ path: `/admin/question-bank/questions/edit/${to.params.id}` }),
            meta: { requiresAuth: true },
         },
         {
            path: 'question-set',
            name: 'admin-question-set',
            component: QuestionSet,
            meta: { requiresAuth: true }
         },
         // Tests
         {
            path: 'tests',
            name: 'admin-question-bank-tests-list',
            component: TestList,
            meta: { requiresAuth: true, title: 'Test List' },
         },
         {
            path: 'tests/create',
            name: 'admin-question-bank-tests-create',
            component: TestCreate,
            meta: { requiresAuth: true, title: 'Create New Test' },
         },
         {
            path: 'tests/edit/:id',
            name: 'admin-question-bank-tests-edit',
            component: TestEdit,
            meta: { requiresAuth: true, title: 'Edit Test' },
         },
         // New Question Bank routes
         {
            path: 'question-bank',
            redirect: '/admin/question-bank/question-sets',
            meta: { requiresAuth: true },
            children: [
               // Question Sets
               {
                  path: 'question-sets',
                  name: 'admin-question-bank-question-sets',
                  component: QuestionSetList,
                  meta: { requiresAuth: true },
               },
               {
                  path: 'question-sets/create',
                  name: 'admin-question-bank-question-sets-create',
                  component: QuestionSetCreate,
                  meta: { requiresAuth: true },
               },
               {
                  path: 'question-sets/edit/:id',
                  name: 'admin-question-bank-question-sets-edit',
                  component: QuestionSetEdit,
                  meta: { requiresAuth: true },
               },

               // Questions
               {
                  path: 'questions',
                  name: 'admin-question-bank-questions',
                  component: QuestionAdminList,
                  meta: { requiresAuth: true },
               },
               {
                  path: 'questions/create',
                  name: 'admin-question-bank-questions-create',
                  component: QuestionAdminCreate,
                  meta: { requiresAuth: true },
               },
               {
                  path: 'questions/edit/:id',
                  name: 'admin-question-bank-questions-edit',
                  component: QuestionAdminEdit,
                  meta: { requiresAuth: true },
               },
            ]
         },
      ]
   },
   {
      path: '/admin/login',
      component: AdminLogin,
      beforeEnter: (to, from, next) => {
         // If user is already authenticated, redirect to /admin
         if (isAuthenticated()) {
            next('/admin')
         } else {
            next()
         }
      }
   }
]

export default routes