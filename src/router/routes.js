//import UserFeed from 'pages/user-feed'
import IndexPage from 'pages/IndexPage.vue'
import AdminLogin from 'pages/admin/Login.vue'
import AdminDashboard from 'pages/admin/AdminDashboard.vue'
import OrdersView from 'src/pages/orders/OrdersView.vue'
import auth from './middlewares/auth'
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'order', component: () => import('pages/orders/OrdersView.vue') }
    ]
  },
  {
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
    children: [
      { 
        path: '', 
        component: () => import('pages/admin/AdminDashboard.vue'),
        name: 'adminDashboard'
      },
      { 
        path: 'menu', 
        component: () => import('pages/admin/AdminMenu.vue'),
        name: 'adminMenu'
      },
      /*{ 
        path: 'orders/dashboard', 
        component: () => AdminMenu,
        name: 'admimOrderDashboard'
      },*/
    ],
    meta: {
      middlewares: [auth]
    },
  },
  {
    path: '/admin/login/',
    component: () => import('layouts/AdminLoginLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/admin/Login.vue'),
        name: 'adminLogin',
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
