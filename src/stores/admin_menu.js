import { defineStore } from 'pinia';
import { uchipRequest } from '../utils/uchipRequest';   
export const useAdminMenuStore = defineStore('admin_menu', {
    state: () => ({
        menu_items: [],
        loading: false,
    }),
    getters: {
        menuCategories: (state) => {
            return state.menu_items;
        }
    },
    actions: {
        async updateProductName(category_id, product_id, new_name){
            try{
                const cat_index = this.menu_items.findIndex((cat) => cat.id == category_id);
                const pr_index = this.menu_items[cat_index].products.findIndex((pr) => pr.id == product_id);
                this.menu_items[cat_index].products[pr_index].name = new_name;
            } catch (error) {
                console.log(error)
            }
        },
        async setCategoriesMap(new_map){
            //this.loading = true;
            let categories = [];
            let categories_request = [];
            new_map.forEach((category, index) => {
                const new_order = index + 1;
                categories.push({
                    ...category,
                    order: new_order
                });
                categories_request.push({
                    id: category.id,
                    order: new_order
                });
            })
            this.menu_items = categories;
            try {
                const data = await uchipRequest.post('admin/menu/categories/update-order', {
                    new_order_map: categories_request
                });
                if (data.status == 'success') {
                    //this.is_logged_in = true;
                    //this.setUserData(data);
                    //this.menu_items = data.home;
                }
            }
            catch (error) {
                console.log(error)
            }
            //this.loading = false;
        },
        async loadMenuInformation(){
            this.loading = true;
            try {
                const data = await uchipRequest.get('admin/menu');
                if (data.status == 'success') {
                    //this.is_logged_in = true;
                    //this.setUserData(data);
                    this.menu_items = data.home;
                }
            }
            catch (error) {
                console.log(error)
            }
            this.loading = false;
        }
    },
});
