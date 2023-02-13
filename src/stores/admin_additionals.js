import { defineStore } from 'pinia';
import { uchipRequest } from '../utils/uchipRequest';
import { Notify } from 'quasar'
import { useAdminMenuStore } from './admin_menu'
export const useAdminAdditionalsStore = defineStore('admin_additionals', {
    state: () => ({
        product: null,
        item_deleting: null,
        additional_list: [],
        products_list: [],
        data_loading: false,
        lastTransactionOk: false,
    }),
    getters: {
        newCategoryItem: (state) => {
            return state.additional_list.find((add) => add?.type_ui === 'new_item');
        },
        isShowingDialog: (state) => {
            return state.product != null;
        },
        isShowingConfirmDialog: (state) => {
            return state.item_deleting != null;
        },
        itemDeleting: (state) => {
            return state.item_deleting;
        },
        productsList: (state) => {
            //console.log(state.products_list.filter((pr) => pr.id != state.product.id));
            return state.product === null ? state.products_list : state.products_list.filter((pr) => pr.id != state.product.id);
        },
        productFeatured: (state) => {
            //console.log(state.products_list.filter((pr) => pr.id != state.product.id));
            return state.product === null ? false : {
                id: state.product.id,
                name: state.product.name,
            };
        },

        isDataLoading: (state) => {
            return state.data_loading;
        },
        list: (state) => {
            const getListFromProduct = () => {
                if (state.additional_list.length === 0){
                    return [];
                }
                let associateds = [];
                let others = [];
                const prod_additionals = state.product.additionals;
                state.additional_list.forEach((add) => {
                    if (add?.type_ui !== 'new_item'){
                        if (prod_additionals.findIndex((pradd) => pradd.id === add.id) >= 0) {

                            associateds.push({
                                ...add,
                                list_type: 'additional'
                            });
                        } else {
                            others.push({
                                ...add,
                                list_type: 'additional'
                            });
                        }
                    }
                });
                return [{
                    list_type: 'title',
                    title: 'Categorias vinculadas a: ' + state.product.name
                    }].concat(associateds.length === 0 ? [{
                        list_type: 'not_linked',
                    }] : associateds).concat(others.length > 0 ? [{
                        list_type: 'title',
                        title: 'Otras categorias'
                    }] : []).concat(others);
            }
            return state.product === null ? state.additional_list : getListFromProduct();
        }
    },
    actions: {
        showConfirmDialog(item) {
            this.item_deleting = item;
        },
        showProductDialog(product) {
            console.log('LLAMADOI');
            this.product = product;
        },
        resetNewCategory() {
            this.additional_list.map(cat => {
                return {
                    ...cat,
                    type_ui: null
                }
            });
        },
        async addNewAdditionalCategory() {
            try {
                this.lastTransactionOk = false;
                const data = await uchipRequest.get('admin/menu/additionals');
                if (data.status == 'success') {
                    //const add_index = this.additional_list.findIndex((add) => add.id == id);
                    this.resetNewCategory();
                    this.additional_list.push({
                        name: 'Nueva categoria.',
                        id: 68,
                        deleted_at: null,
                        items_data: [],
                        max_items: 1,
                        min_items: 1,
                        products: [],
                        required: false,
                        single: true,
                        type_ui: 'new_item'
                    });
                    this.lastTransactionOk = true;
                    Notify.create({
                        type: 'positive',
                        color: 'positive',
                        timeout: 2500,
                        position: 'top-right',
                        message: 'Cambios guardados con exito'
                    });
                }
            }
            catch (error) {
                console.log(error)
            }
        },
        async loadData() {
            this.data_loading = true;
            try {
                //const menu = useAdminMenuStore();
                //menu.loadMenuInformation();
                const data = await uchipRequest.get('admin/menu/additionals');
                if (data.status == 'success') {
                    this.additional_list = data.additionals.map((cat) => {
                        return {
                            ...cat,
                            products: cat.products.map((prod) => prod.id)
                        }
                    });
                    this.products_list = data.products;
                }
            }
            catch (error) {
                console.log(error)
            }
            this.data_loading = false;
        },
        async updateOptionsQty(id, newval, type) {
            try {
                const add_index = this.additional_list.findIndex((add) => add.id == id);
                if(type == 'max'){
                    this.additional_list[add_index].max_items = newval;
                }else{
                    this.additional_list[add_index].min_items = newval;
                }
                //const menu = useAdminMenuStore();
                //menu.loadMenuInformation();
                const data = await uchipRequest.get('admin/menu/additionals');
                if (data.status == 'success') {
                    Notify.create({
                        type: 'positive',
                        color: 'positive',
                        timeout: 2500,
                        position: 'top-right',
                        message: 'Cambios guardados con exito'
                    });
                }
            }
            catch (error) {
                console.log(error)
            }
        },
        async updateBehavior(id, newval, type) {
            try {
                const add_index = this.additional_list.findIndex((add) => add.id == id);
                if (type == 'req'){
                    this.additional_list[add_index].required = newval;
                }else{
                    this.additional_list[add_index].single = newval;
                }
                //const menu = useAdminMenuStore();
                //menu.loadMenuInformation();
                const data = await uchipRequest.get('admin/menu/additionals');
                if (data.status == 'success') {
                    Notify.create({
                        type: 'positive',
                        color: 'positive',
                        timeout: 2500,
                        position: 'top-right',
                        message: 'Cambios guardados con exito'
                    });
                }
            }
            catch (error) {
                console.log(error)
            }
        },
        async updateOption(catId, optId, newval, type) {
            try {
                const add_index = this.additional_list.findIndex((add) => add.id == catId);
                const opt_index = this.additional_list[add_index].items_data.findIndex((opt) => opt.id == optId);
                if (type == 'name'){
                    this.additional_list[add_index].items_data[opt_index].name = newval;
                }else if (type == 'price'){
                    this.additional_list[add_index].items_data[opt_index].price = newval;
                }else if (type == 'status'){
                    this.additional_list[add_index].items_data[opt_index].active = newval;
                }else{
                    this.additional_list[add_index].items_data[opt_index].max = newval;
                }
                const data = await uchipRequest.get('admin/menu/additionals');
                if (data.status == 'success') {
                    Notify.create({
                        type: 'positive',
                        color: 'positive',
                        timeout: 2500,
                        position: 'top-right',
                        message: 'Cambios guardados con exito'
                    });
                }
            }
            catch (error) {
                console.log(error)
            }
        },
        async addNewOption(id) {
            try {
                const data = await uchipRequest.post('admin/menu/products/additionals');
                if (data.status == 'success') {
                    const add_index = this.additional_list.findIndex((add) => add.id == id);
                    this.additional_list[add_index].items_data.push({
                        id: this.additional_list[add_index].length,
                        max: 1,
                        price: 0,
                        active: true,
                        name: 'Nuevo adicional',
                        order: this.additional_list[add_index].length,
                    });
                    Notify.create({
                        type: 'positive',
                        color: 'positive',
                        timeout: 2500,
                        position: 'top-right',
                        message: 'Cambios guardados con exito'
                    });
                }
            }
            catch (error) {
                console.log(error)
            }
        },
        async setCategoryOptionsMap(id, values) {
            try {
                const add_index = this.additional_list.findIndex((add) => add.id == id);
                console.log(values);
                console.log(this.additional_list[add_index].items_data);
                let options = [];
                values.forEach((option, index) => {
                    const new_order = index + 1;
                    options.push({
                        ...option,
                        order: new_order
                    });
                    /*products_request.push({
                        id: product.id,
                        order: new_order
                    });*/
                })
                this.additional_list[add_index].items_data = options;
                const data = await uchipRequest.post('admin/menu/products/additionals');
                if (data.status == 'success') {
                    Notify.create({
                        type: 'positive',
                        color: 'positive',
                        timeout: 2500,
                        position: 'top-right',
                        message: 'Cambios guardados con exito'
                    });
                }
            }
            catch (error) {
                console.log(error)
            }
        },
        async productsAssociation(add_category, products) {
            //this.data_loading = true;
            try {
                const id = add_category.id;
                const add_index = this.additional_list.findIndex((add) => add.id == id);
                const getItemChanged = () => {
                    if (products.length > this.additional_list[add_index].products.length){
                        return {
                            product_id: products[products.length - 1],
                            category_id: id,
                            category_name: add_category.name,
                            type: 'add'
                        }
                    } else if (products.length < this.additional_list[add_index].products.length){
                        for (const pr of this.additional_list[add_index].products) {
                            if (products.findIndex(newpr => newpr === pr) === -1){
                                return {
                                    product_id: pr,
                                    category_id: id,
                                    category_name: add_category.name,
                                    type: 'remove'
                                };
                            }
                        }
                    }
                    return null;
                }
                const { updateProductAdditionals } = useAdminMenuStore();
                //console.log(getItemChanged());
                updateProductAdditionals(getItemChanged());
                this.additional_list[add_index].products = products;
                //console.log(this.additional_list[add_index]);
                
                /*const data = await uchipRequest.get('admin/menu/additionals');
                if (data.status == 'success') {
                    //this.additional_list = data.additionals;
                    //this.products_list = data.products;
                }*/
            }
            catch (error) {
                console.log(error)
            }
            //this.data_loading = false;
        }
    },
});
