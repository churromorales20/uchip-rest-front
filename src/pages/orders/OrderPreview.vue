<template>
    <div class="order-view-items-ul">
        <TransitionGroup leave-active-class="animated fadeOut">
            <div class="order-view-items-ul-item" v-for="(item, item_index) in oStore.itemsDetail"
                :key="'_order_item_' + item_index">
                <div class="order-view-item-content">
                    <div class="order-view-item-content-image"
                        :style="{ 'background-image': 'url(https://d3lryrecr523dy.cloudfront.net/companies/products/images/800/' + item.image + ')' }">
                    </div>
                    <div class="order-view-item-content-desc">
    
                        <q-expansion-item>
                            <template v-slot:header>
                                <q-item-section>
                                    <h6>{{ item.name }}</h6>
                                    <div class="order-view-item-content-total">
                                        <span>S/. {{ item.total }}</span>
                                        <span v-if="item.total < item.total_normal" class="order-view-item-discount">
                                            {{ percentDiscount(item.total_normal, item.total) }}
                                        </span>
                                    </div>
                                    <span v-show="item.comments != ''">"{{ item.comments }}"</span>
                                </q-item-section>
                            </template>
                            <q-card>
                                <q-card-section>
                                    <ul class="order-view-item-adds-ul">
                                        <li v-for="(add, add_index) in item.additionals"
                                            :key="'_product_' + item_index + '_add_' + add_index">+{{ add.qty }} {{
                                                add.name
                                            }}</li>
                                    </ul>
                                </q-card-section>
                            </q-card>
                        </q-expansion-item>
    
                    </div>
                </div>
                <div class="order-view-item-controls">
                    <q-btn @click="minusBtnAction(item_index)" size="sm" push color="accent" round
                        :icon="'fa ' + (oStore.items[item_index].sell.qty == 1 ? 'fa-trash' : 'fa-minus')" />
                    <q-input v-model.number="oStore.items[item_index].sell.qty" type="number" filled />
                    <q-btn @click="plusBtnAction(item_index)" size="sm" push color="green" round
                        icon="fa-regular fa-plus" />
                </div>
            </div>
        </TransitionGroup>
    </div>
</template>
<script>
import { defineComponent } from 'vue'
import { useOrdersStore } from 'stores/orders';
export default defineComponent({
    name: 'OrderModal',
    methods: {
        minusBtnAction(index){
            if (this.oStore.items[index].sell.qty == 1){
                this.oStore.removeProductByIndex(index);
            }else{
                this.oStore.minusProductByIndex(index);
            }
        },
        plusBtnAction(index){
            this.oStore.plusProductByIndex(index);
        },
        percentDiscount: function (normal, discount) {
            return '-' + Math.ceil((((normal - discount) * 100) / normal)) + '%';
        }
    },
    setup() {
        const oStore = useOrdersStore();
        return {
            oStore,
        }
    }
})
</script>