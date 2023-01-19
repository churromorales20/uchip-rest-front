import { uchipRequest } from '../../utils/uchipRequest';
const delay = ms => new Promise(res => setTimeout(res, ms));
export default {
    checkAdditionalExceeded(index) {
        const add = this.product_featured.sell.additionals[index];
        let is_exceeded = false;
        if (add.single == 0 && add.max_items == add.items_data.filter((item) => { return item.selected }).length) {
            is_exceeded = true;
        }
        this.product_featured.sell.additionals[index].exceeded = is_exceeded;
    },
    minusAdditionalItem(index_additional, index_option) {
        if (this.product_featured.sell.additionals[index_additional].items_data[index_option].selected > 1) {
            this.product_featured.sell.additionals[index_additional].items_data[index_option].selected--;
        }
    },
    plusAdditionalItem(index_additional, index_option) {
        if (this.product_featured.sell.additionals[index_additional].items_data[index_option].selected < 10) {
            this.product_featured.sell.additionals[index_additional].items_data[index_option].selected++;
        }
    },
    minusQtySell() {
        if (this.product_featured.sell.qty > 1) {
            this.product_featured.sell.qty--;
        }
    },
    plusQtySell() {
        if (this.product_featured.sell.qty < 10) {
            this.product_featured.sell.qty++;
        }
    },
    serProductViewing(view_product, previous_sell) {
        this.product_viewing = view_product == null ? false : true;
        this.product_featured = view_product == null ? null : {
            ...view_product,
            sell: {
                total: view_product.price_discount !== null ? view_product.price_discount : view_product.price,
                normal_price: view_product.price,
                qty: 1,
                comments: '',
                additionals: view_product.additionals.map((add) => {
                    let is_numeric = add.items_data.filter((item) => { return item.max > 1 }).length > 0 ? true : false;
                    return {
                        ...add,
                        exceeded: false,
                        blink: false,
                        numeric_selector: is_numeric,
                        items_data: add.items_data.map((item) => {
                            return {
                                ...item,
                                selected: is_numeric ? 0 : false
                            }
                        })
                    }
                })
            }
        };
    },
    async fetchProducts() {
        try {
            let context = this;
            const data = await uchipRequest.get('products/home');
            if (data.status == 'success') {
                this.products_map = data.home;
            }
            this.loaded = true;
        }
        catch (error) {
            console.log(error)
        }
    },
    async isProductValidForSell() {
        let valid = true;
        //let local_sell = this.product_featured.sell;
        for (let add_index = 0; add_index < this.product_featured.sell.additionals.length; add_index++) {
            let add = this.product_featured.sell.additionals[add_index];
            if (add.required && add.items_data.filter((item) => item.selected !== false && item.selected != '' && item.selected != 0).length < add.min_items) {
                this.product_featured.sell.additionals[add_index].blink = true;
                await delay(1);
                this.product_featured.sell.additionals[add_index].blink = false;
                valid = false;
            }
        }
        return valid;
    },
};