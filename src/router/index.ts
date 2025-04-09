import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/acceder',
    name: 'acceder',
    component: () => import('../views/AccederDView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/accederangel',
    name: 'accederangel',
    component: () => import('../views/LuisAngelview.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/sharonlinda',
    name: 'sharonlinda',
    component: () => import('../views/sharonView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/natinfluencer',
    name: 'natinfluencer',
    component: () => import('../views/natiView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/natinicio',
    name: 'natinicio',
    component: () => import('../views/InicioNathView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/Profile',
    name: 'Profile',
    component: () => import('../components/molecules/DProfile.vue'),
    meta: { requiresAuth: false },
    redirect: '/Profile/posts',
    children: [
      {
        path: 'posts',
        name: 'ProfilePosts',
        component: () => import('../views/Posts.vue')
      },
      {
        path: 'notifications',
        name: 'ProfileNotifications',
        component: () => import('../views/Notifications.vue')
      }
    ]
  },
  {
    path: '/news',
    name: 'News',
    component: () => import('../views/News.vue')
  },
  {
    path: '/clubs',
    name: 'Clubs',
    component: () => import('../views/angpost.vue')
  },
  {
    path: '/user-posts',
    name: 'UserPosts',
    component: () => import('../views/anguserposts.vue')
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;