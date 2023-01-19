import { defineStore } from 'pinia';
import { uchipRequest } from '../utils/uchipRequest';
const updateAddressesLocalStorage = (addresses) => {
    localStorage.setItem("order_addresses", JSON.stringify(addresses));
}
const defaultMapLocation = {
    lat: -12.1496977,
    lng: -77.0212908
};
const initialUserAddress = {
    address: '',
    point: {
        lat: 0,
        lng: 0
    }
}
export const useDeliveryAddressStore = defineStore('delivery_address', {
    state: () => ({
        delivery_addresses: [],
        autocomplete:{
            options: [],
            session_id: null,
        },
        index_to_delete: -1,
        selected_address_index: -1,
        window_view: 'book',
        loading_geocode: false,
        show_autocomplete: false,
        map_selector_ubication: defaultMapLocation,
        map_selector_text_address: '',
        show_delete_address_confirmation: false,
        initial_address: initialUserAddress,
        new_address: {
            name: '',
            text: initialUserAddress.address,
            reference: '',
            point: initialUserAddress.point
        }
    }),
    getters: {
        isNewAddressValid: (state) => {
            return !(state.new_address.point.lat === 0 || 
                    state.new_address.lng === 0 || 
                    state.new_address.name == '' || 
                    state.new_address.text == '')
        },
        selectedAddress: (state) => {
            return state.selected_address_index === -1 ? {} : state.delivery_addresses[state.selected_address_index];
        },
        showDeleteAddressConfirmation: (state) => {
            return state.show_delete_address_confirmation;
        },
        addressToDelete: (state) => {
            return state.index_to_delete >= 0 ? state.delivery_addresses[state.index_to_delete] : null;
        },
        showAutocomplete: (state) => {
            return state.show_autocomplete;
        },
        autocompleteOptions: (state) => {
            return state.autocomplete.options;
        },
        mapSelectorLocation: (state) => {
            return state.map_selector_ubication;
        },
        mapSelectorTextAddress: (state) => {
            return state.map_selector_text_address;
        },
    },
    actions: {
        setIndexToDelete(index){
            this.index_to_delete = index;
            this.show_delete_address_confirmation = index == -1 ? false : true;
        },
        deleteAddress(){
            const _length = this.delivery_addresses.length
            let index_local = this.index_to_delete;
            this.setIndexToDelete(-1);
            this.delivery_addresses = this.delivery_addresses.slice(0, index_local).concat(this.delivery_addresses.slice(index_local + 1));
            updateAddressesLocalStorage(this.delivery_addresses);
            if (this.selected_address_index == index_local) {
                this.selected_address_index = -1
            }
        },
        setWindowView(view){
            this.window_view = view;
        },
        setSelectedAddressIndex(index){
            this.selected_address_index = index;
        },
        setMapSelectorTextAddress(address){
            this.map_selector_text_address = address;
        },
        async setNewAddress(address){
            const place_request = await uchipRequest.get('addresses/place/info', {
                place_id: address.place_id,
                session_id: this.autocomplete.session_id === null ? '' : this.autocomplete.session_id
            });
            if (place_request.status == 'success') {
                this.new_address.text = address.description;
                this.new_address.point = place_request.info.geometry.location
            }
        }, 
        setNewAddressFromMap(chage_view) {
            this.new_address.text = this.map_selector_text_address;
            this.new_address.point = Object.assign({}, this.map_selector_ubication);
            if (chage_view !== false){
                this.setWindowView('new_address');
            }
        },
        resetNewAddress() {
            console.log('NEW YORRR');
            this.new_address = {
                name: '',
                text: this.initial_address.address,
                reference: '',
                point: Object.assign({}, this.initial_address.point) 
            }
            console.log(this.new_address);
        },
        setNewAddressFromUserLocation(user_location, set_default) {
            this.map_selector_text_address = user_location.address;
            this.map_selector_ubication = user_location.point;
            this.setNewAddressFromMap(false);
            if (set_default === true){
                this.initial_address = user_location;
            }
        },
        setMapSelectorLocation(point) {
            this.map_selector_ubication = point;
        },
        addDeliveryAddress() {
            console.log('VERTE');
            this.delivery_addresses.push({
                ...this.new_address
            });
            this.selected_address_index = this.delivery_addresses.length - 1;
            updateAddressesLocalStorage(this.delivery_addresses);
        },
        loadDeliveryAddresses() {
            const addresses_stored = localStorage.getItem("order_addresses");
            this.delivery_addresses = addresses_stored !== null && addresses_stored != '' ? JSON.parse(addresses_stored) : [];
        },
        async loadGeocodeAutocomplete(term){
            this.loading_geocode = true;
            this.show_autocomplete = true;
            const data = await uchipRequest.get('addresses/autocomplete', {
                place_term: term,
                session_id: this.autocomplete.session_id === null ? '' : this.autocomplete.session_id
            });
            if (data.status == 'success') {
                this.autocomplete.options = data.places.predictions.map((prediction) => {
                    return {
                        description: prediction.description,
                        place_id: prediction.place_id
                    }
                });
                this.autocomplete.session_id = data.session_id;
            }
            this.loading_geocode = false;
        }
    },
});
