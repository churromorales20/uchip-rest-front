import { defineStore } from 'pinia';
import { uchipRequest } from '../utils/uchipRequest';
import { Notify } from 'quasar'

export const useAdminAdditionalsStore = defineStore('admin_additionals', {
    state: () => ({
        product: null,
        additional_list: [],
        data_loading: false,
    }),
    getters: {
        isShowingDialog: (state) => {
            return state.product != null;
        },
        isDataLoading: (state) => {
            return state.data_loading;
        }
    },
    actions: {
        showProductDialog(product) {
            this.product = product;
        },
        async loadData() {
            this.data_loading = true;
            try {
                
                const data = await uchipRequest.post('admin/menu/categories/changestatus');
                if (data.status == 'success') {
                    console.log('LOADED');
                }
            }
            catch (error) {
                console.log(error)
            }
            //this.data_loading = false;
        }
    },
});
