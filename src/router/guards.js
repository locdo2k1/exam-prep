import { jwtDecode } from 'jwt-decode';


// Authentication helpers
export function isAuthenticated() {
   const token = localStorage.getItem('token');

   if (!token) {
      return false;
   }

   try {
      // Decode and check expiration
      const decoded = jwtDecode(token);

      // Check if token is expired
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
         console.log('Token expired');
         localStorage.removeItem('token');
         return false;
      }

      return true;
   } catch (error) {
      console.log('Token verification failed:', error);
      return false;
   }
}

export function getUserRole() {
   return localStorage.getItem('userRole') || 'guest'
}

// The main guard function
export function setupRouteGuards(router) {
   router.beforeEach((to, from, next) => {
      // Check if the route requires authentication
      if (to.matched.some(record => record.meta.requiresAuth && !['/user/login', '/user/signup'].includes(to.path))) {
         if (!isAuthenticated()) {
            next({
               path: '/user/login',
               query: { redirect: to.fullPath }
            })
            return
         }

         // Check for required role
         // const userRole = getUserRole()
         // if (to.matched.some(record => record.meta.requiredRole)) {
         //    const routeWithRole = to.matched.find(record => record.meta.requiredRole)

         //    if (routeWithRole && routeWithRole.meta.requiredRole !== userRole) {
         //       next({ path: '/unauthorized' })
         //       return
         //    }
         // }
      }

      next()
   })
}