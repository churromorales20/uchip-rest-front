<template>
    <q-dialog 
        @hide="modalClosed" 
        v-model="oStore.show_preview" 
        :persistent="oStore.isPlacingOrder || oStore.isCheckingOrder">
        
        <q-card class="order-preview-modal">
            <q-card-section>
                <h2 class="order-preview-modal-title">Tu pedido - <span class="order-preview-modal-title-total">Total: S/. 24,50</span><span class="order-preview-modal-title-itemsno"> ({{ oStore.totalItems }} {{ oStore.totalItems > 1 ? 'items' : 'item' }})</span></h2>
                <q-stepper
                    v-if="oStore.totalItems > 0"
                    class="order-stepper" 
                    v-model="orderStep" 
                    ref="stepper" 
                    color="secondary" 
                    animated>
                    <q-step :name="1" :title="'Resumen (' + oStore.totalItems + ' ' + (oStore.totalItems > 1 ? 'items' : 'item') + ')'" icon="fa-solid fa-cart-shopping" :done="orderStep > 1">
                        <OrderPreview />
                    </q-step>
                    <q-step :name="2" title="Datos personales" icon="fa-solid fa-credit-card" :done="orderStep > 2">
                        <div class="row justify-center order-preview-user-info">
                            <div class="col-12 col-md-8">
                                <OrderUserData />
                            </div>
                        </div>
                    </q-step>
                    <q-step :name="3" title="Entrega" class="order-preview-delivery" icon="fa-solid fa-user" :done="orderStep > 3">
                        <div class="row justify-center">
                            <!--<div class="col-12 col-md-6 order-preview-delivery-user">
                                <h5>Datos personales</h5>
                                
                            </div>-->
                            <div class="col-12 col-md-10 order-preview-delivery-address">
                                <OrderDelivery />
                            </div>
                        </div>
                    </q-step>

                    <q-step :name="4" title="Pago y confirmacion" icon="fa-solid fa-credit-card" :done="orderStep > 4">
                        <div class="row justify-center">
                            <div class="col-12 col-md-8">
                                <OrderConfirmation />
                            </div>
                        </div>
                    </q-step>
                
                    <template v-slot:navigation>
                        <div class="order-stepper-navigation">
                            <h6 v-if="oStore.error_message != ''">{{ oStore.error_message }}</h6>
                            <q-stepper-navigation>
                                <q-btn v-if="orderStep == 1" color="secondary" @click="continueShopping()" icon="fa-solid fa-utensils" :disable="oStore.isCheckingOrder" label="Continuar eligiendo"
                                    class="q-ml-sm" />
                                <q-btn v-if="orderStep == 1" color="accent" @click="readyToOrderPressed" icon="fa fa-arrow-right" :loading="oStore.isCheckingOrder" :disable="oStore.isCheckingOrder" label="Listo para ordenar!"
                                    class="q-ml-sm" />
                                <OrderDeliveryButtons v-if="orderStep == 3" :parentStepper="$refs.stepper" />
                                <q-btn v-if="orderStep == 2 || orderStep > 3" flat color="secondary" icon="fa fa-arrow-left" @click="$refs.stepper.previous()" :disable="oStore.isPlacingOrder || oStore.isCheckingCoupon" label="Volver" class="q-mr-sm" />
                                <q-btn v-if="orderStep == 2" @click="continueButtonPressed" icon="fa fa-arrow-right" color="accent" label="Continuar" />
                                <q-btn :loading="oStore.isPlacingOrder" :disable="oStore.isPlacingOrder || oStore.isCheckingCoupon" v-if="orderStep === 4" @click="confirmOrderButtonPressed" color="secondary" label="Finalizar la orden" />
                                
                            </q-stepper-navigation>
                        </div>
                    </template>
                </q-stepper>
                <div class="order-preview-modal-empty" v-else>
                    <div class="order-preview-modal-empty-title">
                        <h5>Aun no has agredado nada a tu orden.</h5>
                    </div>
                    <div>
                        <q-btn @click="confirmOrderButtonPressed" color="secondary" label="Cerrar" />
                    </div>
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>
<script>
import { defineComponent, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useOrdersStore } from 'stores/orders';
import { useUserStore } from 'stores/user'
import { useDeliveryAddressStore } from 'stores/delivery_address';
import OrderPreview from './OrderPreview.vue';
import OrderDeliveryButtons from './OrderDeliveryButtons.vue';
import OrderUserData from './OrderUserData.vue';
import OrderDelivery from './OrderDelivery.vue';
import OrderConfirmation from './OrderConfirmation.vue';
export default defineComponent({
    name: 'OrderModal',
    components: {
        OrderPreview,
        OrderDelivery,
        OrderDeliveryButtons,
        OrderUserData,
        OrderConfirmation
    },
    methods:{
        async readyToOrderPressed(){
            const response = await this.oStore.preCheck(() => {
                this.$refs.stepper.next();  
            });
        },
        modalClosed(){
            this.orderStep = 1;
        },
        async confirmOrderButtonPressed(){
            if (this.oStore.validate()){
                const res = await this.oStore.send({
                    user: this.uStore.dataObject,
                    delivery_address: this.aStore.selectedAddress
                });
                if(res !== false){
                    this.q.notify({
                        message: 'Tu orden ha sido creada.',
                        icon: 'fa-solid fa-check',
                        position: 'top-right',
                        timeout: 4000,
                        classes: 'order-alerts-created'
                    });
                }
            }
        },
        continueShopping(){
            this.oStore.setPreviewState(false);
        },
        continueButtonPressed(){
            if (this.orderStep == 2){
                this.saveUserData();
            }else{
                this.$refs.stepper.next()
            }
        },
        saveUserData(){
            if (this.uStore.isValidForOrder){
                this.uStore.saveUserData();
                this.$refs.stepper.next();
            }else{
                this.oStore.setError('Ingresa los datos requeridos.');
            }
        }
    },
    setup() {
        const oStore = useOrdersStore();
        const aStore = useDeliveryAddressStore();
        const uStore = useUserStore();
        uStore.loadData();
        const q = useQuasar()
        return {
            q,
            oStore,
            uStore,
            aStore,
            orderStep: ref(1),
            text: ref('')
        }
    }
})
</script>