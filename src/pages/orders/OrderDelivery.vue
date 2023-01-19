<template>
    <q-dialog v-model="aStore.show_delete_address_confirmation" persistent transition-show="scale" transition-hide="scale">
        <q-card class="confirmation-modal">
            <q-card-section>
                <h5>Atencion</h5>
                <p>Estas a punto de eliminar la direcicon: </p>
                <p class="confirmation-modal-item-name">
                    {{ aStore.addressToDelete.text }}
                </p>
                <p>Confirma que deseas continuar.</p>
            </q-card-section>
    
            <q-card-actions align="right" class="bg-white text-teal">
                <q-btn color="accent"  flat label="Cancelar" v-close-popup />
                <q-btn 
                    class="btn-delete-address"
                    color="secondary" 
                    @click="aStore.deleteAddress()"
                    label="Continuar" 
                    icon="fa-solid fa-trash" />
            </q-card-actions>
        </q-card>
    </q-dialog>
    <div v-if="aStore.window_view == 'book'">
        <h5>Selecciona direccion de entrega</h5>
        <ul class="order-preview-delivery-address-book">
            <TransitionGroup 
                leave-active-class="animated fadeOut">
                <li @mouseover="showByIndex = index_address" @mouseout="showByIndex = null" v-for="(address, index_address) in aStore.delivery_addresses" :key="'_user_address_' + index_address">
                    <q-radio @click="oStore.setError('')" v-model="aStore.selected_address_index" :val="index_address">
                        <div class="order-delivery-address-book-label">
                            <div>
                                <h4>{{ address?.text }}</h4>
                                <h6>{{ (address?.reference ? (address?.reference + ' - ') : '') + address.name }}</h6>
                            </div>
                        </div>
                    </q-radio>
                    <div class="order-delivery-address-book-delete" v-show="showByIndex == index_address">
                        <q-btn
                            color="accent"
                            flat
                            class="q-ml-sm" 
                            @click="confirmAddressDeletion(index_address)"
                            :disable="aStore.mapSelectorTextAddress == ''" 
                            icon="fa-solid fa-trash"/>
                    </div>
                </li>
            </TransitionGroup>
        </ul>
    </div>
    <div v-else-if="aStore.window_view == 'new_address'">
        <OrderNewAddressForm />
    </div>
    <div v-else class="order-delivery-address-map">
        <h5>Ubica direccion de entrega</h5>
        <OrderAddressMap />
    </div>
</template>
<script>
import { ref, onMounted, defineComponent } from 'vue'
import { useOrdersStore } from 'stores/orders';
import { useDeliveryAddressStore } from 'stores/delivery_address';
import OrderAddressMap from './OrderAddressMap.vue';
import { uchipMapUtils } from '../..//utils/UchipMapsUtils.js'
import OrderNewAddressForm from './OrderNewAddressForm.vue';
import { Geolocation } from '@capacitor/geolocation'
export default defineComponent({
    name: 'OrderDelivery',
    components:{
        OrderAddressMap,
        OrderNewAddressForm
    },
    methods: {
        setView(view){
            aStore.setWindowView(view);
        },
        confirmAddressDeletion(index){
            this.aStore.setIndexToDelete(index);
            this.showDeleteAddressConfirmation = index >= 0;
        }
    },
    setup() {
        const oStore = useOrdersStore();
        const aStore = useDeliveryAddressStore();
        aStore.loadDeliveryAddresses();
        const getCurrentPosition = async () => {
            try {
                const newPosition = await Geolocation.getCurrentPosition();
                //const newPosition = await Geolocation.getCurrentPosition();
                //console.log('dddd', newPosition.coords.latitude);
                const address = await uchipMapUtils.reverseGeocode(newPosition.coords.latitude, newPosition.coords.longitude);
                //console.log(address);
                aStore.setNewAddressFromUserLocation({
                    address: address,
                    point: {
                        lat: newPosition.coords.latitude,
                        lng: newPosition.coords.longitude
                    }
                }, true);
            } catch (err) {
                if (err.code === 1) {
                    console.log('User denied access to location');
                } else {
                    console.log('An error occurred while trying to retrieve location: ', err);
                }
            }
        }
        onMounted(() => {
            getCurrentPosition();
        });
        aStore.setWindowView(aStore.delivery_addresses.length > 0 ? 'book' : 'new_address');
        return {
            oStore,
            aStore,
            showByIndex: ref(null),
            indexToDelete: ref(-1),
            showDeleteAddressConfirmation: ref(false),
        }
    }
})
</script>