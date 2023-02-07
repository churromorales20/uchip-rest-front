import { boot } from 'quasar/wrappers'

export default boot(({ app }) => {

  app.config.globalProperties.$images_path = 'https://d3lryrecr523dy.cloudfront.net/companies/products/images/800/';
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API 
})
