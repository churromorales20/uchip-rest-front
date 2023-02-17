import { boot } from 'quasar/wrappers'

export default boot(({ app }) => {

  app.config.globalProperties.$images_path = 'https://uchip.artisanburgers.pe/admin/menu/products/images/';
  //app.config.globalProperties.$images_path = 'http://localhost:8000/admin/menu/products/images/';
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API 
})
