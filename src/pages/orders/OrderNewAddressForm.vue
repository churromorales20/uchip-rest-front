<template>
    <h5>Nueva direccion de entrega</h5>
    <!--<q-input v-model="aStore.new_address.text" @keyup="debouncedSearch" label="Ingresa tu direccion"
        hint="EJ: Jr. Callao 245, Barranco." :dense="false">
        <template v-slot:prepend>
            <q-icon name="fa-solid fa-compass" />
        </template>
    </q-input>-->
    <div class="order-delivery-address-autocomplete">
        <q-select 
            :model-value="aStore.new_address.text" 
            use-input 
            hide-selected 
            fill-input 
            input-debounce="0" 
            :options="aStore.autocompleteOptions"
            @filter="filterFn"
            hint="EJ: Jr. Callao 245, Barranco."
            :loading="aStore.loading_geocode"
            label="Ingresa tu direccion">
            <template v-slot:prepend>
                <q-icon name="fa-solid fa-compass" />
            </template>
            <template v-slot:no-option>
                <q-item>
                    <q-item-section class="text-grey">
                        No results
                    </q-item-section>
                </q-item>
            </template>
            <template v-slot:option="scope">
                <q-item class="order-delivery-address-autocomplete-option" v-bind="scope.itemProps" @click="addressSelected(scope.opt)" v-on="scope.itemEvents">
                    <q-item-section avatar>
                        <q-icon name="fa-solid fa-location-pin"></q-icon>
                    </q-item-section>
                    <q-item-section>
                        <!--<q-item-label v-html="scope.opt.label"></q-item-label>-->
                        <q-item-label caption>{{ scope.opt.description }}</q-item-label>
                    </q-item-section>
                </q-item>
            </template>
        </q-select>
    </div>
    <!--<div class="order-delivery-address-autocomplete" v-if="aStore.showAutocomplete">
        <div>
            <div>
                <div class="order-delivery-address-autocomplete-loader" v-if="aStore.loading_geocode">
                    <q-circular-progress indeterminate size="36px" :thickness="0.3" rounded color="secondary" track-color="grey-3"
                        class="q-ma-sm" />
                </div>
                <div v-else-if="aStore.autocompleteOptions.length == 0">
                    No resuktados
                </div>
                <div v-else class="order-delivery-address-autocomplete-results">
                    <ul>
                        <li v-for="(option, index_option) in aStore.autocompleteOptions" :key="'_option_address_' + index_option">
                            {{ option.description }}</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>-->
    <div class="order-delivery-address-inmapbtn"><a href="#" @click="viewMapSelector">Seleecionar en el mapa</a></div>
    <q-input v-model="aStore.new_address.reference" label="Especificaciones" hint="Ej: Derpatamento 8-10, Puerta gris, etc." :dense="false">
        <template v-slot:prepend>
            <q-icon name="fa-solid fa-location-pin" />
        </template>
    </q-input>
    <q-input v-model="aStore.new_address.name" label="Nombre referencial" hint="casa, trabajo, oficina, etc." :dense="false">
        <template v-slot:prepend>
            <q-icon name="fa-solid fa-compass" />
        </template>
    </q-input>
</template>
<script>
import { ref, onMounted, onBeforeUnmount, defineComponent } from 'vue'
import { EventBus } from 'quasar'
import { useOrdersStore } from 'stores/orders';
import { useDeliveryAddressStore } from 'stores/delivery_address';
export default defineComponent({
    name: 'OrderNewAddressForm',
    methods: {
        addressSelected(option){
            this.aStore.setNewAddress(option);
        },
        viewMapSelector(){
            this.oStore.setError('');
            this.aStore.setWindowView('map')
        },
        filterFn(term, update, abort) {
            //let optionsMar = this.optionsMar;
            update(() => {
                const needle = term.toLocaleLowerCase()
                this.aStore.loadGeocodeAutocomplete(term)
                //this.optionsMar = stringOptions.filter(v => v.description.toLocaleLowerCase().indexOf(needle) > -1)
            });
        },
        saveAddress() {
            if (this.aStore.isNewAddressValid) {
                this.oStore.setError('');
                this.aStore.addDeliveryAddress();
                this.aStore.setWindowView('book');
                this.aStore.resetNewAddress();
            } else {
                this.oStore.setError('Que peo');
            }
        },
    },
    mounted(){
        this.emitter.on('save-address-btn-pressed', (evt) => {
            this.saveAddress();
        });
    },
    beforeUnmount() {
        this.emitter.off('save-address-btn-pressed');
    },
    setup() {
        const oStore = useOrdersStore();
        const aStore = useDeliveryAddressStore();
        const bus = new EventBus()
        /*onMounted(() => {
            $emitter.on('some-event', () => {
                console.log('LPAIAIIAIIII');
            })
        });*/
        //elem.addEventListener('build', (e) => { /* … */ }, false);
        return {
            oStore,
            aStore,
            bus,
            selected: ref(null),
            thickId: ref(0),
        }
    }
})
</script>