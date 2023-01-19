//import UserFeed from 'pages/user-feed'
import IndexPage from 'pages/IndexPage.vue'
//import OrderView from 'pages/OrderView.vue'
import OrdersView from 'src/pages/orders/OrdersView.vue'
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => IndexPage },
      { path: 'order', component: () => OrdersView }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
