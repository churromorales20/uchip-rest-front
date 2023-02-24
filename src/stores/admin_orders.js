import { defineStore } from 'pinia';
import { uchipRequest } from '../utils/uchipRequest';
const loaded_filters = JSON.parse(localStorage.getItem("admin_filters_val")) ;
export const useAdminOrdersStore = defineStore('admin_orders', {
    state: () => ({
        loading_live: false,
        live_loaded: false,
        live_orders: [],
        live_filters: Array.isArray(loaded_filters) ? loaded_filters : [
            'pending',
            'accepted',
        ],
        live_config: {
            max_minutes: 45
        },
        order_featured: null,
        order_to_show: null
    }),
    getters: {
        isLiveLoading: (state) => {
            return state.loading_live;
        },
        liveOrders: (state) => {
            const filters_string = state.live_filters.join(' ');
            return state.live_orders.filter(order => filters_string.includes(order.status)).sort((oa, ob) => {
                if (oa.id < ob.id) {
                    return -1;
                }
                if (oa.id > ob.id) {
                    return 1;
                }
                return 0;
            });
        },
        liveConfig: (state) => {
            return state.live_config;
        },
        liveFilters: (state) => {
            return state.live_filters;
        },
        isOrderFeatured: (state) => {
            return state.order_featured !== null;
        },
        featured: (state) => {
            return state.order_featured;
        },
    },
    actions: {
        viewDetailsById(id){
            const order = this.live_orders.find(order => order.id === id);
            this.order_featured = order === undefined ? null : order;
        },
        setOrderToShow(id){
            this.order_to_show = id;
        },
        setLiveFilters(filters){
            this.live_filters = filters;
            localStorage.setItem("admin_filters_val", JSON.stringify(filters));
        },
        addLiveOrder($order){
            this.live_orders.push($order);
        },
        setViewingOrder(order){
            this.order_featured = order;
        },
        updateLiveOrder(event){
            const order_index = this.live_orders.findIndex((order) => order.id == event.order_id);
            if (order_index >= 0){
                switch (event.change.type) {
                    case 'order_status':
                        this.live_orders[order_index].status = event.change.status;
                        break;
                    case 'payment_status':
                        this.live_orders[order_index].payment_status = event.change.status;
                        break;
                    case 'store_status':
                        this.live_orders[order_index].store_status = event.change.status;
                        break;
                
                    default:
                        break;
                }
            }
        },
        async changeStatusById(id, change) {
            try {
                const data = await uchipRequest.post('admin/orders/status/change', {
                    id: id,
                    change: change
                });
                if (data.status == 'success') {
                    return true;
                }
                return false;
            }
            catch (error) {
                return false;
            }
        },
        showPendingOrder(){
            if (this.order_to_show !== null) {
                this.viewDetailsById(this.order_to_show);
            }
        },
        async loadLiveInformation() {
            if (this.live_loaded === false){
                this.loading_live = true;
                try {
                    const data = await uchipRequest.get('admin/orders/live',);
                    
                    if (data.status == 'success') {
                        this.live_orders = data.orders;
                        this.live_loaded = true;
                        this.showPendingOrder();
                    }
                    //this.loading_live = true;
                }
                catch (error) {
                    console.log(error)
                }
                this.loading_live = false;
            }
        },
    },
});
