import { defineStore } from 'pinia';
import OrdersActions from './orders/actions';

export const useOrdersStore = defineStore('orders', {
    state: () => ({
        configuration: null,
        items:[],
        current_order: 0,
        show_preview: false,
        error_message: '',
        tip_amount: 0,
        payment_method: '',
        coupon_code: '',
        placing_order: false
    }),
    getters: {
        currentlyActive: (state) => {
            return state.current_order;
        },
        tipsActive: (state) => {
            return Array.isArray(state.configuration?.tips) ? state.configuration?.tips : [];
        },
        isPlacingOrder: (state) => {
            return state.placing_order;
        },
        paymentOptions: (state) => {
            return Array.isArray(state.configuration?.payments) ? state.configuration?.payments : [];
        },
        isDiscountActive: (state) => {
            return state.configuration?.active_discounts;
        },
        totalLines: (state) => {
            return state.items.length
        },
        tipAmount: (state) => {
            return state.tip_amount
        },
        totalItems: (state) => {
            let items_count = 0;
            state.items.forEach((item) => {
                items_count += item.sell.qty;
            });
            return items_count;
        },
        itemsDetail: (state) => {
            return state.items.map((item) => {
                let additionals = [];
                let total_additionals = 0;
                item.sell.additionals.forEach(add_parent => {
                    add_parent.items_data.forEach(add => {
                        if (add.selected !== false && add.selected != '' && add.selected != 0) {
                            const qty = add_parent.numeric_selector === true ? add.selected : 1;
                            additionals.push({
                                name: add.name,
                                qty: qty,
                                price: add.price
                            });
                            total_additionals += qty * add.price;
                        }
                    });
                });
                return {
                    name: item.name,
                    id: item.id,
                    image: item.image,
                    unit_price: item.sell.total,
                    total_normal: (total_additionals + item.sell.normal_price) * item.sell.qty,
                    total: (total_additionals + item.sell.total) * item.sell.qty,
                    additionals: additionals,
                    qty: item.sell.qty,
                    comments: item.sell?.comments ? item.sell?.comments : ''
                }
            });
        },
        itemsDetail4Order: (state) => {
            return state.items.map((item) => {
                let additionals = [];
                let total_additionals = 0;
                item.sell.additionals.forEach(add_parent => {
                    add_parent.items_data.forEach(add => {
                        if (add.selected !== false && add.selected != '' && add.selected != 0) {
                            const qty = add_parent.numeric_selector === true ? add.selected : 1;
                            additionals.push({
                                name: add.name,
                                qty: qty,
                                price: add.price
                            });
                            total_additionals += qty * add.price;
                        }
                    });
                });
                return {
                    //name: item.name,
                    id: item.id,
                    total_additionals: total_additionals,
                    //image: item.image,
                    //unit_price: item.sell.total,
                    //total_normal: (total_additionals + item.sell.normal_price) * item.sell.qty,
                    //total: (total_additionals + item.sell.total) * item.sell.qty,
                    additionals: additionals,
                    qty: item.sell.qty,
                    comments: item.sell?.comments ? item.sell?.comments : ''
                }
            });
        },
        getProductSell: (state) => (id) => {
            const product = state.items.find((product) => product.id == id);
            return product === undefined ? undefined : product.sell;
        }
    },
    actions: OrdersActions,
});
