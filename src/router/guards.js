// src/router/guards.js

// Authentication helpers
export function isAuthenticated() {
   return localStorage.getItem('token') !== null
}

export function getUserRole() {
   return localStorage.getItem('userRole') || 'guest'
}

// The main guard function
export function setupRouteGuards(router) {
   router.beforeEach((to, from, next) => {
      // Check if the route requires authentication
      console.log(to.matched);

      if (to.matched.some(record => record.meta.requiresAuth && !['/user/login', '/user/signup'].includes(to.path))) {
         if (!isAuthenticated()) {
            next({
               path: '/login',
               query: { redirect: to.fullPath }
            })
            return
         }

         // Check for required role
         const userRole = getUserRole()
         if (to.matched.some(record => record.meta.requiredRole)) {
            const routeWithRole = to.matched.find(record => record.meta.requiredRole)

            if (routeWithRole && routeWithRole.meta.requiredRole !== userRole) {
               next({ path: '/unauthorized' })
               return
            }
         }
      }

      next()
   })
}