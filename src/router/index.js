import { createRouter, createWebHistory } from "vue-router"
import routes from "./router"
import { setupRouteGuards } from "./guards"

const router = createRouter({
   history: createWebHistory(),
   routes
})

// Apply the guards
setupRouteGuards(router)

export default router