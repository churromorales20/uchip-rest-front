<template>
  <ProductModal />
  <HomeProducts />
</template>

<script>
import { defineComponent } from 'vue'
import ProductModal from './home/ProductModal.vue';
import HomeProducts from './home/HomeProducts.vue';

//import { useUserStore } from 'stores/user';
export default defineComponent({
  name: 'OrderView',
  components: {
    ProductModal,
    HomeProducts
  }
})
</script>
