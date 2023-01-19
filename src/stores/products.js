import { defineStore } from 'pinia';
import ProductActions from './products/actions';
export const useProductsStore = defineStore('products', {
  state: () => ({
    loaded: false,
    products_map: [],
    product_viewing: false,
    product_featured: null,
  }),
  getters: {
    productFeaturedTotal: (state) => {
      let total_additionals = 0;
      state.product_featured.sell.additionals.forEach(add => {
        add.items_data.forEach((item) => {
          if(item.selected === true){
            total_additionals += item.price;
          }
        });
      });
      return (state.product_featured.sell.total + total_additionals) * state.product_featured.sell.qty;
    },
    isCheckboxDisabled: (state) => (index_additional, index_option) => {
      return state.product_featured.sell.additionals[index_additional].exceeded && !state.product_featured.sell.additionals[index_additional].items_data[index_option].selected
    },
    productFeaturedToOrder: (state) => {
      return state.product_featured.sell;
    }
  },
  actions: {
    ...ProductActions,
  },
});
