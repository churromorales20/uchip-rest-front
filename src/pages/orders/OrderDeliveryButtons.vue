<template>
    <q-btn 
        v-if="aStore.window_view == 'book'" 
        flat 
        color="secondary" 
        icon="fa fa-arrow-left"
        @click="parentStepper.previous()" 
        label="Volver" />
    <q-btn 
        v-if="aStore.window_view == 'book'" 
        color="secondary" 
        flat 
        @click="newAddressPressed" 
        icon="fa-solid fa-plus" 
        class="q-ml-sm" 
        label="Nueva direccion" />
    <q-btn 
        v-if="aStore.window_view == 'book'" 
        @click="continueNextStep" 
        color="accent" 
        class="q-ml-sm" 
        icon="fa fa-arrow-right"
        label="Continuar" />
    <q-btn 
        v-if="aStore.window_view == 'new_address' && aStore.delivery_addresses.length > 0" 
        flat 
        color="secondary" 
        icon="fa-solid fa-book"
        @click="aStore.setWindowView('book')" 
        label="Direcciones guardadas" />
    <q-btn 
        v-if="aStore.window_view == 'new_address'" 
        color="accent" 
        @click="saveAddress" 
        icon="fa-regular fa-floppy-disk" 
        class="q-ml-sm"
        label="Guardar" />
    <q-btn 
        v-if="aStore.window_view == 'map'" 
        flat 
        color="secondary" 
        icon="fa fa-arrow-left"
        @click="aStore.setWindowView('new_address')" 
        label="Volver" />
    <q-btn 
        v-if="aStore.window_view == 'map'" 
        color="accent" 
        @click="confirmAddressMap" 
        :disable="aStore.mapSelectorTextAddress == ''"
        icon="fa-solid fa-check"
        class="q-ml-sm"
        label="Confirmar" />
</template>
<script>
import { defineComponent } from 'vue'
import { EventBus } from 'quasar'
import { useOrdersStore } from 'stores/orders';
import { useDeliveryAddressStore } from 'stores/delivery_address';
export default defineComponent({
    name: 'OrderDeliveryButtons',
    props: ['parentStepper'],
    methods: {
        newAddressPressed(){
            this.oStore.setError('');
            this.aStore.setWindowView('new_address');
        },
        saveAddress(){
            this.emitter.emit('save-address-btn-pressed');
        },
        continueNextStep(){
            if(this.aStore.selected_address_index >= 0){
                this.oStore.setError('');
                this.parentStepper.next();
            }else{
                this.oStore.setError('Selecciona una direccion.');
            }
        },
        confirmAddressMap() {
            this.aStore.setNewAddressFromMap();
            this.aStore.setWindowView('new_address');
        },
    },
    setup() {
        const oStore = useOrdersStore();
        const aStore = useDeliveryAddressStore();
        return {
            oStore,
            aStore
        }
    }
})
</script>