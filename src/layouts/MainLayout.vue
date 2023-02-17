<template>
  <div v-if="!pStore.loaded" class="main-wrapper">
    <q-circular-progress 
      indeterminate size="200px" 
      :thickness="0.1" 
      rounded 
      color="secondary" 
      track-color="grey-3"
      class="q-ma-md" />
  </div>
  <div v-else class="main-container">
    <OrderModal />
    <div class="main-container-wrapper">
      <div class="artisan-header">
        <img src="~assets/images/logo_trans_orange_shadow.png">
        <transition enter-active-class="animated bounceIn"  leave-active-class="animated bounceOut">
          <div @click="viewOrder()" class="artisan-header-cart" v-if="oStore.currentlyActive != 0">
            <q-icon name="fa-solid fa-cart-shopping" />
            <span>
              Pedido en curso
            </span>
          </div>
        </transition>
        <transition enter-active-class="animated bounceIn"  leave-active-class="animated bounceOut">
          <div @click="viewOrder()" class="artisan-header-cart" v-if="oStore.totalLines > 0">
            <q-icon name="fa-solid fa-cart-shopping" />
            <span>
              Ver mi pedido ({{ oStore.totalItems }})
            </span>
          </div>
        </transition>
      </div>
      <router-view />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useOrdersStore } from 'stores/orders';
import { useProductsStore } from 'stores/products';
import OrderModal from '../pages/orders/OrderModal.vue';

export default {
  name: 'MainLayout',
  displayName: 'MainLayout',
  components: {
    OrderModal,
  },
  methods: {
    viewOrder() {
      //this.$router.push({ path: 'order' });
      this.oStore.setPreviewState(true);
    }
  },
  setup () {
    const leftDrawerOpen = ref(false)

    const pStore = useProductsStore();
    const oStore = useOrdersStore();
    oStore.loadFromStorage();
    pStore.fetchProducts();
    return {
      pStore,
      oStore,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
}
</script>
