// router/index.ts
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/acceder',
      name: 'acceder',
      component: () => import('../views/AccederDView.vue'),
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/accederangel',
      name: 'accederangel',
      component: () => import('../views/LuisAngelview.vue'),
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/sharonlinda',
      name: 'sharonlinda',
      component: () => import('../views/sharonView.vue'),
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/natinfluencer',
      name: 'natinfluencer',
      component: () => import('../views/natiView.vue'),
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/natinicio',
      name: 'natinicio',
      component: () => import('../views/InicioNathView.vue'),
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/Profile',
      name: 'Profile',
      component: () => import('../components/molecules/DProfile.vue'), // Cambiado de ../views/DProfile.vue a ../components/molecules/DProfile.vue
      meta: {
<<<<<<< HEAD
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
=======
        requiresAuth: false,
      },
      redirect: '/Profile/posts', // Redirige por defecto a "Posts"
      children: [
        {
          path: 'posts',
          name: 'ProfilePosts',
          component: () => import('../views/Posts.vue'), // Ya estaba correcto
        },
        {
          path: 'notifications',
          name: 'ProfileNotifications',
          component: () => import('../views/Notifications.vue'), // Ya estaba correcto
        },
      ],
    },
    {
      path: '/news',
      name: 'News',
      component: () => import('../views/News.vue'), // Ya estaba correcto
    },
  ],
});
>>>>>>> 35fc9e7 (pagina funcional de profile)

export default router;