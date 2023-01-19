<template>
    <q-btn 
        v-if="aStore.window_view == 'book'" 
        @click="continueNextStep" 
        color="secondary" 
        label="Continuar" />
    <q-btn 
        v-if="aStore.window_view == 'book'" 
        color="accent" 
        flat 
        @click="newAddressPressed" 
        icon="fa-solid fa-plus" 
        class="q-ml-sm" 
        label="Nueva direccion" />
    <q-btn 
        v-if="aStore.window_view == 'book'" 
        flat 
        color="accent" 
        @click="parentStepper.previous()" 
        label="Volver" 
        class="q-ml-sm" />
    <q-btn 
        v-if="aStore.window_view == 'new_address'" 
        color="secondary" 
        @click="saveAddress" 
        icon="fa-regular fa-floppy-disk" 
        label="Guardar" />
    <q-btn 
        v-if="aStore.window_view == 'new_address' && aStore.delivery_addresses.length > 0" 
        flat 
        color="accent" 
        @click="aStore.setWindowView('book')" 
        label="Direcciones guardadas" 
        class="q-ml-sm" />
    <q-btn 
        v-if="aStore.window_view == 'map'" 
        color="secondary" 
        @click="confirmAddressMap" 
        :disable="aStore.mapSelectorTextAddress == ''"
        icon="fa-solid fa-check"
        label="Confirmar" />
    <q-btn 
        v-if="aStore.window_view == 'map'" 
        flat 
        color="accent" 
        @click="aStore.setWindowView('new_address')" 
        label="Volver"
        class="q-ml-sm" />
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