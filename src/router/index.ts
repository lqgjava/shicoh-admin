import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
      meta: { public: true }
    },
    {
      path: '/',
      name: 'Layout',
      component: () => import('@/layouts/MainLayout.vue'),
      redirect: '/dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('@/views/Dashboard.vue'),
          meta: { title: '控制台' }
        },
        {
          path: 'banners',
          name: 'Banners',
          component: () => import('@/views/content/Banners.vue'),
          meta: { title: '轮播图管理' }
        },
        {
          path: 'products',
          name: 'Products',
          component: () => import('@/views/content/Products.vue'),
          meta: { title: '产品管理' }
        },
        {
          path: 'news',
          name: 'News',
          component: () => import('@/views/content/News.vue'),
          meta: { title: '新闻管理' }
        },
        {
          path: 'company',
          name: 'Company',
          component: () => import('@/views/content/Company.vue'),
          meta: { title: '企业信息' }
        },
        {
          path: 'categories',
          name: 'Categories',
          component: () => import('@/views/content/Categories.vue'),
          meta: { title: '产品分类' }
        },
        {
          path: 'tags',
          name: 'Tags',
          component: () => import('@/views/content/Tags.vue'),
          meta: { title: '产品标签' }
        },
        {
          path: 'news-types',
          name: 'NewsTypes',
          component: () => import('@/views/content/NewsTypes.vue'),
          meta: { title: '新闻类型' }
        },
        {
          path: 'messages',
          name: 'Messages',
          component: () => import('@/views/content/Messages.vue'),
          meta: { title: '留言管理' }
        },
        {
          path: 'partners',
          name: 'Partners',
          component: () => import('@/views/content/Partners.vue'),
          meta: { title: '合作伙伴' }
        },
        {
          path: 'settings',
          name: 'Settings',
          component: () => import('@/views/system/Settings.vue'),
          meta: { title: '系统设置' }
        },
        {
          path: 'profile',
          name: 'Profile',
          component: () => import('@/views/Profile.vue'),
          meta: { title: '个人中心' }
        }
      ]
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  if (!to.meta.public && !userStore.token) {
    next('/login')
  } else if (to.path === '/login' && userStore.token) {
    next('/')
  } else {
    next()
  }
})

export default router
