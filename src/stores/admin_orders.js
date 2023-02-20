import { defineStore } from 'pinia';
import { uchipRequest } from '../utils/uchipRequest';

export const useAdminOrdersStore = defineStore('admin_orders', {
    state: () => ({
        loading_live: false,
        live_loaded: false,
        live_orders: [],
        live_config: {
            max_minutes: 45
        },
        order_featured: null,
    }),
    getters: {
        isLiveLoading: (state) => {
            return state.loading_live;
        },
        liveOrders: (state) => {
            return state.live_orders;
        },
        liveConfig: (state) => {
            return state.live_config;
        },
        isOrderFeatured: (state) => {
            return state.order_featured !== null;
        },
        featured: (state) => {
            return state.order_featured;
        },
    },
    actions: {
        setViewingOrder(order){
            console.log(order);
            this.order_featured = order;
        },
        async loadLiveInformation() {
            if (this.live_loaded === false){
                this.loading_live = true;
                try {
                    const data = await uchipRequest.get('admin/orders/live',);
                    
                    if (data.status == 'success') {
                        this.live_orders = data.orders;
                        this.live_loaded = true;
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
