<template>
  <div class="order-view-backbtn">
    <q-icon name="fa-solid fa-burger" /> Volver al menu
  </div>
  <div class="order-view-container row">
    <div class="col-12 col-md-8">
      <h4 class="order-view-title">Items</h4>
      <ul class="order-view-items-ul">
        <li v-for="(item, item_index) in oStore.itemsDetail" :key="'_order_item_' + item_index">
          <div class="order-view-items-ul-item">
            <div class="order-view-item-content">
              <div class="order-view-item-content-image">
                <q-img v-if="item.image != ''" :src="$images_path + item.image">
                  <template v-slot:error>
                    <div class="absolute-full flex flex-center admin-menu-product-item-image-error">
                      <q-icon name="fa-solid fa-circle-exclamation" />
                      <h5>Error cargando imagen</h5>
                    </div>
                  </template>
                </q-img>
                <div v-else class="flex flex-center admin-menu-product-item-image-uploader">
                  <q-icon name="fa-solid fa-cloud-arrow-up" />
                </div>
              </div>
              <div class="order-view-item-content-desc">
                <h6>{{ item.name }}</h6>
                <span>S/. {{ item.total }}</span>
              </div>
            </div>
            <div class="order-view-item-controls">
              <q-btn @click="minusBtnAction(index_additional, index_option)" size="sm" push color="accent" round
                icon="fa-solid fa-minus" />
              <q-input v-model.number="oStore.items[item_index].sell.qty" type="number" filled />
              <q-btn @click="plusBtnAction(index_additional, index_option)" size="sm" push color="green" round
                icon="fa-regular fa-plus" />
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="col-12 col-md-4">
      <h4 class="order-view-title">Persoana;</h4>
    </div>
  </div>
</template>

<script>
import { useOrdersStore } from 'stores/orders';
export default {
  name: 'OrdersView',
  methods:{
    //getItemSellDetails
  },
  setup() {
    const oStore = useOrdersStore();
    return {
      oStore
    }
  }
}
</script>
