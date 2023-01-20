<template>
    <div v-if="oStore.configuration === null" class="order-confirmation-loader">
        <q-spinner color="secondary" size="4rem" :thickness="3" />
    </div>
   <div v-else>
        <q-expansion-item :dense="true" class="order-confirmation-expand">
            <template v-slot:header>
                <div class="order-confirmation-header">
                    <q-icon name="fa-solid fa-bicycle"></q-icon>
                    <div>
                        <h5>Tu orden: <span>{{ oStore.totalItems }} items</span></h5>
                        <h6>Ver mas imformacion</h6>
                    </div>
                </div>
            </template>
            <q-card>
                <q-card-section>
                    <ul class="order-confirmation-preview">
                        <li v-for="(item, item_index) in oStore.itemsDetail" :key="'_confirmation_order_item_' + item_index">
                            <div class="order-confirmation-item-image"
                                :style="{ 'background-image': 'url(https://d3lryrecr523dy.cloudfront.net/companies/products/images/800/' + item.image + ')' }">
                            </div>
                            <div class="order-confirmation-item-details">
                                <ul>
                                    <li class="order-confirmation-item-details-name">
                                        <h6>x{{ item.qty }} {{ item.name }}</h6>
                                        <h6>S/. {{ item.total }}</h6>
                                    </li>
                                    <li>
                                        <h6>Precio unitario</h6>
                                        <h6>S/. {{ item.unit_price }}</h6>
                                    </li>
                                    <li v-for="(add, add_index) in item.additionals"
                                        :key="'_product_' + item_index + '_add_' + add_index">
                                        <h6>+{{ add.qty }} {{ add.name }}</h6>
                                        <h6>S/. {{ add.qty * add.price }}</h6>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </q-card-section>
            </q-card>
        </q-expansion-item>
        <q-expansion-item :dense="true" class="order-confirmation-expand">
            <template v-slot:header>
                <div class="order-confirmation-preview">
                    <div class="order-confirmation-header">
                        <q-icon name="fa-solid fa-money-bill"></q-icon>
                        <div>
                            <h5>Total: <span>S/. {{ orderTotal }}</span></h5>
                            <h6>Ver mas imformacion</h6>
                        </div>
                    </div>
                </div>
            </template>
            <q-card>
                <q-card-section>
                    <ul class="order-confirmation-total-items">
                        <li v-for="(item, item_index) in oStore.itemsDetail"
                            :key="'_confirmation_order_total_item_' + item_index">
                            <h6>x{{ item.qty }} {{ item.name }}</h6>
                            <h6>S/. {{ item.total_normal }}</h6>
                        </li>
                        <li>
                            <h6>Total descuentos:</h6>
                            <h6>S/. -{{ orderTotalDiscount }}</h6>
                        </li>
                        <li v-show="oStore.couponDiscountTotal > 0">
                            <h6>Cupon descuento <small><b>({{ this.oStore.coupon_code}})</b></small>:</h6>
                            <h6>S/. -{{ this.oStore.couponDiscountTotal}}</h6>
                        </li>
                        <li v-show="oStore.tipAmount > 0">
                            <h6>Propina:</h6>
                            <h6>S/. {{ oStore.tipAmount }}</h6>
                        </li>
                        <li class="order-confirmation-total-items-grand">
                            <h6>Total:</h6>
                            <h6>S/. {{ orderTotal }}</h6>
                        </li>
                    </ul>
                </q-card-section>
            </q-card>
        </q-expansion-item>
        <div v-if="oStore.tipsActive.length > 0" class="order-confirmation-tips">
            <h6 class="order-confirmation-tips-title">Alguna propina para nuestro quipo?</h6>
            <div class="order-confirmation-tips-container">
                <div 
                    v-on:click="oStore.setTipAmount(0)"
                    :class="'order-confirmation-tips-item' + (oStore.tipAmount == 0 ? ' tip-selected' : '')">
                    S/. 0
                </div>
                <div 
                    v-on:click="oStore.setTipAmount(tip)"
                    :class="'order-confirmation-tips-item' + (oStore.tipAmount == tip ? ' tip-selected' : '')"
                    v-for="(tip, tip_index) in oStore.tipsActive" 
                    :key="'tip_' + tip_index + '_order__'">
                    S/. {{ tip }}
                </div>
            </div>
        </div>
        <div v-if="oStore.isDiscountActive" class="order-confirmation-discount">
            <h6>Cupon de descuento</h6>
            <q-input 
                class="order-confirmation-input"
                v-model="oStore.coupon_code" 
                placeholder="MI-DESCUENTO"
                @change="oStore.checkCoupon"
                :loading="oStore.isCheckingCoupon"
                :dense="true">
                <template v-slot:prepend>
                    <q-icon name="fa-solid fa-tag" />
                </template>
            </q-input>
        </div>
        <div class="order-confirmation-discount">
            <h6>Metodo de pago</h6>
            <q-select 
                @update:modelValue="oStore.setError('')"
                class="order-confirmation-input"
                :dense="true"
                v-model="oStore.payment_method" 
                :options="oStore.paymentOptions" 
                options-cover 
                stack-label />
        </div>
   </div>
</template>
<script>
import { defineComponent, ref } from 'vue'
import { useOrdersStore } from 'stores/orders';
import { useUserStore } from 'stores/user'
export default defineComponent({
    name: 'OrderConfirmation',
    methods:{
        checkCoupon(){
            console.log('RODAR');
        }
    },
    computed: {
        orderTotal() {
            return (this.oStore.tipAmount + this.oStore.itemsDetail.reduce((total, item) => {
                return total + item.total;
            }, 0)) - this.oStore.couponDiscountTotal;
        },
        orderTotalDiscount() {
            return this.oStore.itemsDetail.reduce((total, item) => {
                return total + (item.total_normal - item.total);
            }, 0);
        }
    },
    setup() {
        const oStore = useOrdersStore();
        const uStore = useUserStore();
        oStore.loadOrderConfig();
        uStore.loadData();
        return {
            oStore,
            uStore,
        }
    }
})
</script>