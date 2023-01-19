<template>
    <GMapMap 
        :center="center" 
        @click="addressPositionUpdated" 
        ref="addressMap" 
        :options="mapOptions"
        :zoom="15">
        <GMapMarker @dragend="addressPositionUpdated"  :position="aStore.mapSelectorLocation" :draggable="true" />
    </GMapMap>
    <Transition 
        enter-active-class="animated bounceIn" 
        leave-active-class="animated fadeOut">
        <div class="order-delivery-address-map-controls" v-if="aStore.mapSelectorTextAddress != ''">
            <p>{{ aStore.mapSelectorTextAddress }}</p>
        </div>
    </Transition>
</template>
<script>
import { ref, defineComponent } from 'vue'
import { uchipMapUtils } from '../..//utils/UchipMapsUtils.js'
import { useOrdersStore } from 'stores/orders';
import { useDeliveryAddressStore } from 'stores/delivery_address';

export default defineComponent({
    name: 'OrderAddressMap',
    methods: {
        async addressPositionUpdated(ev){
            this.aStore.setMapSelectorLocation({
                lat: ev.latLng.lat(),
                lng: ev.latLng.lng(),
            });
            //this.decodePositionAndEmit();
            const address = await uchipMapUtils.reverseGeocode(ev.latLng.lat(), ev.latLng.lng());
            //this.addressText = address;
            this.aStore.setMapSelectorTextAddress(address);
        },
        async decodePositionAndEmit(){
            const address = await uchipMapUtils.reverseGeocode(this.position.lat, this.position.lng);
            if (address != '') {
                this.$emit('addressPicked', { address: address, position: this.position});
            }
        }
    },
    setup() {
        //uchipMapUtils.reverseGeocode(53.2914890653, -12.139892578);
        const addressMap = ref();
        const oStore = useOrdersStore();
        const aStore = useDeliveryAddressStore();
        return {
            oStore,
            center: ref(aStore.mapSelectorLocation),
            addressMap,
            aStore,
            mapOptions: {
                zoomControl: true,
                mapTypeControl: false,
                scaleControl: false,
                streetViewControl: false,
                rotateControl: false,
                fullscreenControl: false,
            },
            addressText: ref(''),
            //view: ref(oStore.delivery_addresses.length > 0 ? 'book' : 'new_address')
        }
    }
})
</script>