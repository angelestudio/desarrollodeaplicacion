import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/acceder',
      name: 'acceder',
      component: () => import('../views/AccederDView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/accederangel',
      name: 'accederangel',
      component: () => import('../views/LuisAngelview.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/sharonlinda',
      name: 'sharonlinda',
      component: () => import('../views/sharonView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/natinfluencer',
      name: 'natinfluencer',
      component: () => import('../views/natiView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/natinicio',
      name: 'natinicio',
      component: () => import('../views/InicioNathView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/Profile',
      name: 'Profile',
      component: () => import('../components/molecules/DProfile.vue'),
      meta: { requiresAuth: false },
      redirect: '/Profile/posts', // Redirige por defecto a "Posts"
      children: [
        {
          path: 'posts',
          name: 'ProfilePosts',
          component: () => import('../views/Posts.vue'),
        },
        {
          path: 'notifications',
          name: 'ProfileNotifications',
          component: () => import('../views/Notifications.vue'),
        },
        {
          path: 'news',
          name: 'ProfileNews',
          component: () => import('../views/News.vue'),
        },
      ],
    },
    {
      path: '/SignIn',
      name: 'SignIn',
      component: () => import('../views/SignIn.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/SignUp',
      name: 'SignUp',
      component: () => import('../views/SignUp.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/Start here',
      name: 'Start here',
      component: () => import('../views/StartHereview.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/news',
      name: 'News',
      component: () => import('../views/News.vue'),
    },
  ],
});

export default router;