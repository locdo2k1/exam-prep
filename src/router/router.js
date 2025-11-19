import { isAuthenticated } from './guards'
import AdminLayoutWrapper from '../components/admin/layout/AdminLayoutWrapper.vue'

// Layout components
const WelcomePage = () => import(/* webpackChunkName: "welcome" */ '../pages/WelcomePage.vue')
const LayoutUser = () => import(/* webpackChunkName: "layout-user" */ '../components/user/Layout/LayoutUser.vue')
// const AdminLayoutWrapper = () => import(/* webpackChunkName: "layout-admin" */ '../components/admin/layout/AdminLayoutWrapper.vue')

// Admin components
const QuestionAdminList = () => import(/* webpackChunkName: "admin-questions" */ '../pages/admin/question/QuestionAdminList.vue')
const QuestionAdminCreate = () => import(/* webpackChunkName: "admin-questions" */ '../pages/admin/question/QuestionAdminCreate.vue')
const QuestionAdminEdit = () => import(/* webpackChunkName: "admin-questions" */ '../pages/admin/question/QuestionAdminEdit.vue')
const QuestionSet = () => import(/* webpackChunkName: "admin-question-set" */ '../components/question/QuestionSet.vue')
const QuestionSetList = () => import(/* webpackChunkName: "admin-question-set" */ '../pages/admin/question-set/QuestionSetList.vue')
const QuestionSetCreate = () => import(/* webpackChunkName: "admin-question-set" */ '../pages/admin/question-set/QuestionSetCreate.vue')
const QuestionSetEdit = () => import(/* webpackChunkName: "admin-question-set" */ '../pages/admin/question-set/QuestionSetEdit.vue')
const TestList = () => import(/* webpackChunkName: "admin-tests" */ '../pages/admin/test/TestList.vue')
const TestCreate = () => import(/* webpackChunkName: "admin-tests" */ '../pages/admin/test/TestCreate.vue')
const TestEdit = () => import(/* webpackChunkName: "admin-tests" */ '../pages/admin/test/TestEdit.vue')

// User components
const Home = () => import(/* webpackChunkName: "user-home" */ '../components/user/layout/UserHome.vue')
const TestPage = () => import(/* webpackChunkName: "user-test" */ '../pages/user/test mode/TestPage.vue')
const ExamTest = () => import(/* webpackChunkName: "user-exam" */ '../pages/user/test mode/ExamTest.vue')
const SolutionPage = () => import(/* webpackChunkName: "user-solution" */ '../pages/user/solution/SolutionPage.vue')
const Login = () => import(/* webpackChunkName: "auth" */ '../pages/user/Login.vue')
const Signup = () => import(/* webpackChunkName: "auth" */ '../pages/user/Signup.vue')
const AdminLogin = () => import(/* webpackChunkName: "admin-auth" */ '../pages/admin/auth/Login.vue')
const AttemptResult = () => import(/* webpackChunkName: "user-attempt-result" */ '../pages/user/test-attempt/AttemptResult.vue')
const ExamLibrary = () => import(/* webpackChunkName: "user-exam-library" */ '../pages/user/exam/ExamLibrary.vue')

const routes = [
   {
      path: '/',
      component: LayoutUser,
      children: [
         {
            path: '',
            name: 'welcome',
            component: WelcomePage,
         },
      ]
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
            path: 'tests/:id/practice',
            name: 'practice-test',
            component: ExamTest,
            props: route => ({
               isPracticeMode: true,
               partIds: Array.isArray(route.query.part) ? route.query.part : [route.query.part].filter(Boolean),
               timeLimit: route.query.time_limit ? parseInt(route.query.time_limit, 10) : null
            }),
            meta: { requiresAuth: true }
         },
         {
            path: 'test/attempt/:attemptId/result',
            name: 'attempt-result',
            component: AttemptResult,
            meta: { requiresAuth: true },
            props: true
         },
         {
            path: 'solution/:testId',
            name: 'solution-details',
            component: SolutionPage,
            meta: { requiresAuth: true },
            props: route => ({
               testId: route.params.testId
            })
         },
         {
            path: 'tests',
            name: 'test-category',
            component: ExamLibrary,
            meta: { requiresAuth: true },
            props: route => ({
               initialCategory: route.params.testCategory
            })
         },
         {
            path: 'login',
            name: 'login',
            component: Login,
            beforeEnter: (to, from, next) => {
               next()
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
         {
            path: '',
            redirect: '/admin/question-bank/questions',
            meta: { requiresAuth: true },
         },
         // Tests section
         {
            path: 'tests',
            meta: { requiresAuth: true },
            children: [
               {
                  path: '',
                  name: 'admin-question-bank-tests-list',
                  component: TestList,
                  meta: { requiresAuth: true, title: 'Test List' },
               },
               {
                  path: 'create',
                  name: 'admin-question-bank-tests-create',
                  component: TestCreate,
                  meta: { requiresAuth: true, title: 'Create New Test' },
               },
               {
                  path: 'edit/:id',
                  name: 'admin-question-bank-tests-edit',
                  component: TestEdit,
                  meta: { requiresAuth: true, title: 'Edit Test' },
               },
            ]
         },
         // Question Bank section
         {
            path: 'question-bank',
            meta: { requiresAuth: true },
            children: [
               {
                  path: '',
                  redirect: 'question-sets'
               },
               // Question Sets
               {
                  path: 'question-sets',
                  children: [
                     {
                        path: '',
                        name: 'admin-question-bank-question-sets',
                        component: QuestionSetList,
                        meta: { requiresAuth: true },
                     },
                     {
                        path: 'create',
                        name: 'admin-question-bank-question-sets-create',
                        component: QuestionSetCreate,
                        meta: { requiresAuth: true },
                     },
                     {
                        path: 'edit/:id',
                        name: 'admin-question-bank-question-sets-edit',
                        component: QuestionSetEdit,
                        meta: { requiresAuth: true },
                     },
                  ]
               },
               // Questions
               {
                  path: 'questions',
                  children: [
                     {
                        path: '',
                        name: 'admin-question-bank-questions',
                        component: QuestionAdminList,
                        meta: { requiresAuth: true },
                     },
                     {
                        path: 'create',
                        name: 'admin-question-bank-questions-create',
                        component: QuestionAdminCreate,
                        meta: { requiresAuth: true },
                     },
                     {
                        path: 'edit/:id',
                        name: 'admin-question-bank-questions-edit',
                        component: QuestionAdminEdit,
                        meta: { requiresAuth: true },
                     },
                  ]
               },
            ]
         },
         // Legacy redirects
         {
            path: 'question-management',
            redirect: '/admin/question-bank/questions',
         },
         {
            path: 'question-management/create',
            redirect: '/admin/question-bank/questions/create',
         },
         {
            path: 'question-management/edit/:id',
            redirect: to => ({ path: `/admin/question-bank/questions/edit/${to.params.id}` }),
         },
         {
            path: 'question-set',
            name: 'admin-question-set',
            component: QuestionSet,
            meta: { requiresAuth: true }
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