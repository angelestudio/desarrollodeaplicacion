
import { createRouter, createWebHistory } from 'vue-router'
import { getUserFromToken } from '@/composables/useAuth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('@/views/InicioNathView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/acceder',
      name: 'acceder',
      component: () => import('@/views/AccederDView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/accederangel',
      name: 'accederangel',
      component: () => import('@/views/LuisAngelview.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/actualizar-contrasena',
      name: 'ActualizarContrasena',
      component: () => import('@/views/UpdatePasswordView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/sharonlinda',
      name: 'sharonlinda',
      component: () => import('@/views/sharonView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/natinfluencer',
      name: 'natinfluencer',
      component: () => import('@/views/InicioNathView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/natinicio',
      name: 'natinicio',
      component: () => import('@/views/InicioNathView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/signin',
      name: 'SignIn',
      component: () => import('@/views/SignIn.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: () => import('@/views/SignUp.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('@/components/molecules/DProfile.vue'),
      meta: { requiresAuth: true },
      redirect: '/profile/posts',
      children: [
        {
          path: 'posts',
          name: 'ProfilePosts',
          component: () => import('@/views/Posts.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'notifications',
          name: 'ProfileNotifications',
          component: () => import('@/views/Notifications.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'news',
          name: 'ProfileNews',
          component: () => import('@/views/News.vue'),
          meta: { requiresAuth: true },
        },
      ],
    },
    {
      path: '/news',
      name: 'News',
      component: () => import('@/views/News.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/home',
      name: 'Home',
      component: () => import('@/views/Home.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/clubs',
      name: 'Clubs',
      component: () => import('@/views/angpost.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/user-posts',
      name: 'UserPosts',
      component: () => import('@/views/anguserposts.vue'),
      meta: { requiresAuth: true },
    },
    // Ruta comodín para 404 (opcional)
    {
      path: '/:catchAll(.*)',
      redirect: '/',
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const user = getUserFromToken()
    if (!user) {
      // Si no está autenticado, redirige a la página de login (o signup)
      return next({ name: 'SignUp' })
    }
  }
  next()
})

export default router