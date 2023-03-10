import { defineStore } from 'pinia';
import { uchipRequest } from '../utils/uchipRequest';   
import { Notify } from 'quasar'

export const useAdminMenuStore = defineStore('admin_menu', {
    state: () => ({
        menu_items: [],
        loading: false,
        creating_category: false,
        timeout_id: null,
        product_to_delete: null,
    }),
    getters: {
        menuCategories: (state) => {
            return state.menu_items;
        },
        categoriesCopy: (state) => {
            return state.menu_items.map((cat) => {
                return{
                    id: cat.id,
                    name: cat.name
                }
            });
        },
        toDeleteleteConfirm: (state) => {
            return state.product_to_delete !== null;
        },
        itemToDeletelete: (state) => {
            return state.product_to_delete;
        }
    },
    actions: {
        setProductToDelete(product){
            this.product_to_delete = product;
        },
        async copyProductToCategory(product_id, category_copy){
            try{
                
                const data = await uchipRequest.post('admin/menu/products/duplicate',{
                    product_id: product_id,
                    category_id: category_copy
                });
                if (data.status == 'success') {
                    Notify.create({
                        type: 'positive',
                        color: 'positive',
                        timeout: 2500,
                        position: 'top-right',
                        message: 'Cambios guardados con exito'
                    });
                    const cat_index = this.menu_items.findIndex((cat) => cat.id == category_copy);
                    //const product = this.menu_items[cat_index].products.find((pr) => pr.id == product_id);
                    this.menu_items[cat_index].products.push(data.product);
                }
            } catch (error) {
                console.log(error)
            }
        },
        async updateProductInfo(category_id, product_id, new_val, type){
            try{
                const cat_index = this.menu_items.findIndex((cat) => cat.id == category_id);
                const pr_index = this.menu_items[cat_index].products.findIndex((pr) => pr.id == product_id);
                if(type === 'name'){
                    this.menu_items[cat_index].products[pr_index].name = new_val;
                }else{
                    this.menu_items[cat_index].products[pr_index].description = new_val;
                }
                
                if (this.timeout_id !== null) {
                    clearTimeout(this.timeout_id);
                }
                this.timeout_id = setTimeout(async () => {
                    const data = await uchipRequest.post('admin/menu/products/info/update', {
                        type: type === undefined ? 'description' : type,
                        product_id: product_id,
                        new_val: new_val === null ? '' : new_val,
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
            } catch (error) {
                console.log(error)
            }
        },
        async updateProductAdditionalsOrder(category_id, product_id, new_orders){
            try{
                let additionals = [];
                let _request = [];
                new_orders.forEach((add, index) => {
                    const new_order = index + 1;
                    additionals.push({
                        ...add,
                        order: new_order
                    });
                    _request.push({
                        id: add.id,
                        order: new_order
                    });
                })
                const cat_index = this.menu_items.findIndex((cat) => cat.id == category_id);
                const pr_index = this.menu_items[cat_index].products.findIndex((pr) => pr.id == product_id);
                this.menu_items[cat_index].products[pr_index].additionals = additionals;
                const data = await uchipRequest.post('admin/menu/products/additionals/order', {
                    product_id: product_id,
                    new_order: _request
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
            } catch (error) {
                console.log(error)
            }
        },
        async updateProductPrice(category_id, product_id, new_price, discount){
            try{
                const cat_index = this.menu_items.findIndex((cat) => cat.id == category_id);
                const pr_index = this.menu_items[cat_index].products.findIndex((pr) => pr.id == product_id);
                if(discount === undefined){
                    this.menu_items[cat_index].products[pr_index].price = new_price;
                }else{
                    this.menu_items[cat_index].products[pr_index].price_discount = new_price;
                }
                
                if (this.timeout_id !== null) {
                    clearTimeout(this.timeout_id);
                }
                this.timeout_id = setTimeout(async () => {
                    const data = await uchipRequest.post('admin/menu/products/price/update', {
                        product_id: product_id,
                        price: new_price,
                        type: discount === undefined ? 'price' : 'discount',
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
            } catch (error) {
                console.log(error)
            }
        },
        /*async updateProductDescription(category_id, product_id, new_description){
            try{
                const cat_index = this.menu_items.findIndex((cat) => cat.id == category_id);
                const pr_index = this.menu_items[cat_index].products.findIndex((pr) => pr.id == product_id);
                this.menu_items[cat_index].products[pr_index].description = new_description;
                if (this.timeout_id !== null) {
                    clearTimeout(this.timeout_id);
                }
                this.timeout_id = setTimeout(async () => {
                    const data = await uchipRequest.post('admin/menu/categories/update-order');
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
            } catch (error) {
                console.log(error)
            }
        },*/
        async setCategoriesMap(new_map){
            //this.loading = true;
            let categories = [];
            let products_request = [];
            new_map.forEach((category, index) => {
                const new_order = index + 1;
                categories.push({
                    ...category,
                    order: new_order
                });
                products_request.push({
                    id: category.id,
                    order: new_order
                });
            })
            this.menu_items = categories;
            try {
                const data = await uchipRequest.post('admin/menu/categories/order/update', {
                    new_order_map: products_request
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
            //this.loading = false;
        },
        async setCategoryProductsMap(category_id, new_map){
            //this.loading = true;
            let products = [];
            let products_request = [];
            const cat_index = this.menu_items.findIndex((cat) => cat.id == category_id);
            new_map.forEach((product, index) => {
                const new_order = index + 1;
                products.push({
                    ...product,
                    order: new_order
                });
                products_request.push({
                    id: product.id,
                    order: new_order
                });
            })
            this.menu_items[cat_index].products = products;
            try {
                const data = await uchipRequest.post('admin/menu/categories/products/update-order', {
                    new_order_map: products_request,
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
            //this.loading = false;
        },
        async updateImage(base64, product_id) {
            const data = await uchipRequest.post('admin/menu/products/image/update', {
                base64_image: base64,
                product_id: product_id
            });
            if (data.status == 'success') {
                const cat_index = this.menu_items.findIndex((cat) => cat.id == data.category_id);
                const pr_index = this.menu_items[cat_index].products.findIndex((pr) => pr.id == data.product_id);
                this.menu_items[cat_index].products[pr_index].image = data.image_name;
                Notify.create({
                    type: 'positive',
                    color: 'positive',
                    timeout: 2500,
                    position: 'top-right',
                    message: 'Cambios guardados con exito'
                });
            }
        },
        async loadMenuInformation(){
            this.loading = true;
            try {
                const data = await uchipRequest.get('admin/menu');
                if (data.status == 'success') {
                    //this.is_logged_in = true;
                    //this.setUserData(data);
                    this.menu_items = data.home.map((cat) => {
                        return {
                            ...cat,
                            products: cat.products.sort((pa, pb ) =>{
                                if (pa.order < pb.order) {
                                    return -1;
                                }
                                if (pa.order > pb.order) {
                                    return 1;
                                }
                                return 0;
                            })
                        }
                    }).sort((ca, cb) => {
                        if (ca.order < cb.order) {
                            return -1;
                        }
                        if (ca.order > cb.order) {
                            return 1;
                        }
                        return 0;
                    });
                }
            }
            catch (error) {
                console.log(error)
            }
            this.loading = false;
        },
        async createNewCategory(){
            this.creating_category = true;
            try {
                const data = await uchipRequest.post('admin/menu/categories/create');
                if (data.status == 'success') {
                    this.menu_items.push(data.category);
                }
            }
            catch (error) {
                console.log(error)
            }
            this.creating_category = false;
        },
        async deleteCategory(id){
            try {
                const data = await uchipRequest.post('admin/menu/categories/delete',{
                    category_id: id,
                });
                if (data.status == 'success') {
                    this.menu_items = this.menu_items.filter((item_cat) => item_cat.id != id);
                    Notify.create({
                        type: 'positive',
                        color: 'positive',
                        timeout: 3500,
                        position: 'top-right',
                        message: 'La categoria se ha eliminado con exito'
                    })
                }
            }
            catch (error) {
                console.log(error)
            }
        },
        async deleteProduct(){
            try {
                const data = await uchipRequest.post('/admin/menu/products/delete', {
                    id: this.product_to_delete.product_id
                });
                if (data.status == 'success') {
                    const cat_index = this.menu_items.findIndex((cat) => cat.id == this.product_to_delete.category_id);
                    this.menu_items[cat_index].products = this.menu_items[cat_index].products.filter((prod) => prod.id != this.product_to_delete.product_id);
                    //this.menu_items = this.menu_items.filter((item_cat) => item_cat.id != category_id);
                    Notify.create({
                        type: 'positive',
                        color: 'positive',
                        timeout: 3500,
                        position: 'top-right',
                        message: 'El producto se ha eliminado con exito.'
                    })
                    this.product_to_delete =  null;
                }
            }
            catch (error) {
                console.log(error)
            }
        },
        async addNewProduct(category_id){
            try {
                const data = await uchipRequest.post('/admin/menu/products/create', {
                    category_id: category_id
                });
                if (data.status == 'success') {
                    const cat_index = this.menu_items.findIndex((cat) => cat.id == category_id);
                    this.menu_items[cat_index].products.push(data.product);
                    //this.menu_items = this.menu_items.filter((item_cat) => item_cat.id != category_id);
                    Notify.create({
                        type: 'positive',
                        color: 'positive',
                        timeout: 3500,
                        position: 'top-right',
                        message: 'El producto se ha agregado con exito.'
                    })
                }
            }
            catch (error) {
                console.log(error)
            }
        },
        async setCategoryName(id, newname){
            try {
                const cat_index = this.menu_items.findIndex((cat) => cat.id == id);
                this.menu_items[cat_index].name = newname;
                console.log(this.timeout_id);
                if (this.timeout_id !== null){
                    clearTimeout(this.timeout_id);
                }
                this.timeout_id = setTimeout(async () => {
                    const data = await uchipRequest.post('admin/menu/categories/name/update',{
                        category_id: id,
                        new_name: newname
                    });
                    if (data.status == 'success') {
                        Notify.create({
                            type: 'positive',
                            color: 'positive',
                            timeout: 2500,
                            position: 'top-right',
                            message: 'Cambios guardados con exito'
                        })
                        //app.config.globalProperties..emit('save-address-btn-pressed');
                        console.log('dddd');
                        this.timeout_id = null;
                        //this.menu_items = this.menu_items.filter((item_cat) => item_cat.id != id);
                    }
                }, 450);
                
            }
            catch (error) {
                console.log(error)
            }
        },
        async removeProductAssociation(product_id, additional_id) {
            await this.updateProductAdditionals({
                product_id: product_id,
                type: 'remove',
                category_id: additional_id
            });
        },
        async updateProductAdditionals(change){
            try {
                if (this.menu_items.length > 0) {
                    let found = false;
                    let cat_index = 0;
                    for (const category of this.menu_items) {
                        let prod_index = 0;
                        for (const product of category.products) {
                            if (product.id === change.product_id) {
                                if (change.type === 'add') {
                                    this.menu_items[cat_index].products[prod_index].additionals.push({
                                        name: change.category_name,
                                        id: change.category_id,
                                    });
                                }else{
                                    this.menu_items[cat_index].products[prod_index].additionals = this.menu_items[cat_index].products[prod_index].additionals.filter(add => add.id != change.category_id)
                                }
                                found = true;
                                break;
                            }
                            prod_index++;
                        }
                        if (found) {
                            break;
                        }
                        cat_index++
                    }
                }
                const data = await uchipRequest.post('admin/menu/products/additionals/association', change);
                if (data.status == 'success') {
                    /*//this.menu_items = this.menu_items.filter((item_cat) => item_cat.id != id);
                    const cat_index = this.menu_items.findIndex((cat) => cat.id == id);
                    //console.log(this.menu_items);
                    this.menu_items[cat_index].deleted_at = this.menu_items[cat_index].deleted_at === null ? true : null;*/
                    Notify.create({
                        type: 'positive',
                        color: 'positive',
                        timeout: 2500,
                        position: 'top-right',
                        message: 'Cambios guardados con exito'
                    })
                }
            }
            catch (error) {
                console.log(error)
            }
        },
        async changeCategoryStatus(id){
            try {
                const cat_index = this.menu_items.findIndex((cat) => cat.id == id);
                const new_status = this.menu_items[cat_index].deleted_at !== null;
                const data = await uchipRequest.post('admin/menu/categories/status/update',{
                    category_id: id,
                    new_status: new_status
                });
                if (data.status == 'success') {
                    //this.menu_items = this.menu_items.filter((item_cat) => item_cat.id != id);
                    const cat_index = this.menu_items.findIndex((cat) => cat.id == id);
                    //console.log(this.menu_items);
                    this.menu_items[cat_index].deleted_at = new_status ? null : true;
                    Notify.create({
                        type: 'positive',
                        color: 'positive',
                        timeout: 2500,
                        position: 'top-right',
                        message: 'Status actualizado con exito'
                    })
                }
            }
            catch (error) {
                console.log(error)
            }
        },
        async changeProductStatus(category_id, product_id){
            try {
                const cat_index = this.menu_items.findIndex((cat) => cat.id == category_id);
                const pr_index = this.menu_items[cat_index].products.findIndex((pr) => pr.id == product_id);
                const new_val = this.menu_items[cat_index].products[pr_index].deleted_at !== null;
                const data = await uchipRequest.post('admin/menu/products/status/update', {
                    product_id: product_id,
                    new_val: new_val,
                });
                if (data.status == 'success') {
                   
                    this.menu_items[cat_index].products[pr_index].deleted_at = !new_val ? true : null;
                    Notify.create({
                        type: 'positive',
                        color: 'positive',
                        timeout: 2500,
                        position: 'top-right',
                        message: 'Status actualizado con exito'
                    })
                }
            }
            catch (error) {
                console.log(error)
            }
        }
    },
});
