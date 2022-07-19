import Vue from 'vue';
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: () => import("@/layouts/index.vue"),
    redirect: '/login',
    children: [
      {
        path: '/info',
        component: () => import('@/pages/info/index.vue')
      },
      {
        path: '/detail',
        component: () => import("@/pages/detail/index.vue")
      },   
      {
        path: '/list',
        component: () => import("@/pages/list/index.vue")
      },
      {
        path: '/sign',
        component: () => import("@/pages/sign/index.vue")
      },
      {
        path: '/login',
        component: () => import("@/pages/login/index.vue")
      }
    ]
  },
]

const router = new VueRouter({
  routes
})

export default router
