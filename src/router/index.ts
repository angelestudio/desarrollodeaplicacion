import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (LoginView-[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/LoginView.vue'),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/acceder',
      name: 'acceder',
      // route level code-splitting
      // this generates a separate chunk (LoginView-[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AccederDView.vue'),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/accederangel',
      name: 'accederangel',
      // route level code-splitting
      // this generates a separate chunk (LoginView-[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/LuisAngelview.vue'),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/sharonlinda',
      name: 'sharonlinda',
      // route level code-splitting
      // this generates a separate chunk (LoginView-[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/sharonView.vue'),
      meta: {
        requiresAuth: false
      }
    },

    {
      path: '/natinfluencer',
      name: 'natinfluencer',
      // route level code-splitting
      // this generates a separate chunk (LoginView-[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/natiView.vue'),
      meta: {
        requiresAuth: false
      }
    },
  
    {
      path: '/natinicio',
      name: 'natinicio',
      // route level code-splitting
      // this generates a separate chunk (LoginView-[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/InicioNathView.vue'),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/Profile',
      name: 'Profile',
      // route level code-splitting
      // this generates a separate chunk (LoginView-[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Profileview.vue'),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/SignIn',
      name: 'SignIn',
      // route level code-splitting
      // this generates a separate chunk (LoginView-[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/SignIn.vue'),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/SignUp',
      name: 'SignUp',
      // route level code-splitting
      // this generates a separate chunk (LoginView-[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/SignUp.vue'),
      meta: {
        requiresAuth: false
      }
    }
    
   
  ]
})


export default router
