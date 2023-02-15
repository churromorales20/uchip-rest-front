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
        timeout_id: null
    }),
    getters: {
        newCategoryItem: (state) => {
            return state.additional_list.find((add) => add?.type_ui === 'new_item');
        },
        thereIsNewCategory: (state) => {
            return state.additional_list.findIndex((add) => add?.type_ui === 'new_item') >= 0;
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
                console.log(state.additional_list);
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
            this.product = product;
        },
        resetNewCategory() {
            this.additional_list = this.additional_list.map(cat => {
                return {
                    ...cat,
                    type_ui: null
                }
            });
        },
        async addNewAdditionalCategory() {
            try {
                this.lastTransactionOk = false;
                const data = await uchipRequest.get('admin/menu/additionals/create');
                if (data.status == 'success') {
                    //const add_index = this.additional_list.findIndex((add) => add.id == id);
                    this.resetNewCategory();
                    this.additional_list.push({
                        ...data.category,
                        type_ui: 'new_item'
                    });
                    console.log(this.additional_list);
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
        async duplicateCategory(id) {
            try {
                this.lastTransactionOk = false;
                const data = await uchipRequest.post('admin/menu/additionals/duplicate', {
                    id: id
                });
                if (data.status == 'success') {
                    //const add_index = this.additional_list.findIndex((add) => add.id == id);
                    this.resetNewCategory();
                    this.additional_list.push({
                        ...data.category,
                        type_ui: 'new_item'
                    });
                    console.log(this.additional_list);
                    this.lastTransactionOk = true;
                    Notify.create({
                        type: 'positive',
                        color: 'positive',
                        timeout: 2500,
                        position: 'top-right',
                        message: 'Categoria duplicada con exito'
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
                if (this.timeout_id !== null) {
                    clearTimeout(this.timeout_id);
                }
                this.timeout_id = setTimeout(async () => {
                    const data = await uchipRequest.post('admin/menu/additionals/update/quantity', {
                        type: type,
                        value: newval,
                        id: id
                    });
                    if (data.status == 'success') {
                        Notify.create({
                            type: 'positive',
                            color: 'positive',
                            timeout: 2500,
                            position: 'top-right',
                            message: 'Cambios guardados con exito'
                        });
                    }
                }, 650);
            }
            catch (error) {
                console.log(error)
            }
        },
        async delete() {
            try {
                const url = this.item_deleting.type === 'option' ? 'admin/menu/additionals/options/delete' : 'admin/menu/additionals/delete';
                const data = await uchipRequest.post(url, this.item_deleting);
                if (data.status == 'success') {
                    let message = 'Categoría de adicionales borrada con éxito.';
                    if (this.item_deleting.type === 'option'){
                        message = 'Opción eliminada con éxito.';
                        const add_index = this.additional_list.findIndex((add) => add.id == this.item_deleting.category_id);
                        //const opt_index = this.additional_list[add_index].items_data.findIndex((opt) => opt.id == this.item_deleting.id);
                        this.additional_list[add_index].items_data = this.additional_list[add_index].items_data.filter(opt => opt.id != this.item_deleting.id);
                    }else{
                        this.additional_list = this.additional_list.filter(add => add.id != this.item_deleting.id);
                        //REMOVE CATEGORY FROM LIST AND FROM PRODUCTS
                    }
                    Notify.create({
                        type: 'positive',
                        color: 'positive',
                        timeout: 2500,
                        position: 'top-right',
                        message: message
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
                const data = await uchipRequest.post('admin/menu/additionals/update/behavior', {
                    id : id,
                    value : newval === true ? 1 : 0,
                    type : type,
                });
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
                }else if (type == 'price') {
                    newval = newval.toFixed(2);
                    this.additional_list[add_index].items_data[opt_index].price = newval;
                } else {
                    this.additional_list[add_index].items_data[opt_index].max = newval;
                }
                if (this.timeout_id !== null) {
                    clearTimeout(this.timeout_id);
                }
                this.timeout_id = setTimeout(async () => {
                    const data = await uchipRequest.post('admin/menu/additionals/options/update', {
                        type: type,
                        option_id: optId,
                        new_val: newval
                    });
                    if (data.status == 'success') {
                        Notify.create({
                            type: 'positive',
                            color: 'positive',
                            timeout: 2500,
                            position: 'top-right',
                            message: 'Cambios guardados con exito'
                        });
                    }
                }, 450);
            }
            catch (error) {
                console.log(error)
            }
        },
        async updateName(catId, newval) {
            try {
                const add_index = this.additional_list.findIndex((add) => add.id == catId);
                this.additional_list[add_index].name = newval;
                if (this.timeout_id !== null) {
                    clearTimeout(this.timeout_id);
                }
                this.timeout_id = setTimeout(async () => {
                    const data = await uchipRequest.post('admin/menu/additionals/update/name', {
                        id: catId,
                        value: newval
                    });
                    if (data.status == 'success') {
                        Notify.create({
                            type: 'positive',
                            color: 'positive',
                            timeout: 2500,
                            position: 'top-right',
                            message: 'Cambios guardados con exito'
                        });
                    }
                }, 450);
            }
            catch (error) {
                console.log(error)
            }
        },
        async updateOptionStatus(catId, optId, newval) {
            try {
                const add_index = this.additional_list.findIndex((add) => add.id == catId);
                const opt_index = this.additional_list[add_index].items_data.findIndex((opt) => opt.id == optId);
                this.additional_list[add_index].items_data[opt_index].active = newval;
                const data = await uchipRequest.post('admin/menu/additionals/options/update', {
                    type: 'status',
                    option_id: optId,
                    new_val: newval
                });
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
                const data = await uchipRequest.post('admin/menu/additionals/options/add', {
                    category_id: id
                });
                if (data.status == 'success') {
                    const add_index = this.additional_list.findIndex((add) => add.id == id);
                    this.additional_list[add_index].items_data.push(data.option);
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
                let options = [];
                let options_request = [];
                values.forEach((option, index) => {
                    const new_order = index + 1;
                    options.push({
                        ...option,
                        order: new_order
                    });
                    options_request.push({
                        id: option.id,
                        order: new_order
                    });
                })
                this.additional_list[add_index].items_data = options;
                if (this.timeout_id !== null) {
                    clearTimeout(this.timeout_id);
                }
                this.timeout_id = setTimeout(async () => {
                    const data = await uchipRequest.post('admin/menu/additionals/options/order', {
                        options_order: options_request
                    });
                    if (data.status == 'success') {
                        Notify.create({
                            type: 'positive',
                            color: 'positive',
                            timeout: 2500,
                            position: 'top-right',
                            message: 'Cambios guardados con exito'
                        });
                    }
                }, 600);
                
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
