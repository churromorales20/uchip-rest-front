<template>
  <!--<div v-if="!pStore.loaded" class="main-wrapper">
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
  </div>-->
  <router-view />
  
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  /*setup() {
    const pStore = useProductsStore();
    const oStore = useOrdersStore();
    oStore.loadFromStorage();
    pStore.fetchProducts();
    return {
      pStore,
      oStore
    }
  }*/
})
</script>
