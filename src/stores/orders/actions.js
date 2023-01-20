import { uchipRequest } from '../../utils/uchipRequest';
const updateOrderLocalStorage = (items) => {
    localStorage.setItem("order_items", JSON.stringify(items));
}
export default {
    minusProductByIndex(index_item) {
        if (this.items[index_item].sell.qty > 1) {
            this.items[index_item].sell.qty--;
        }
        updateOrderLocalStorage(this.items);
    },
    validate() {
        if (this.payment_method == '') {
            this.setError("Selecciona un forma de pago valida.");
            return false;
        }
        this.setError("");
        return true;
    },
    reset() {
        this.configuration = null;
        this.items = [];
        updateOrderLocalStorage(this.items);
        this.show_preview = false;
        this.error_message = '';
        this.tip_amount = 0;
        this.payment_method = '';
        this.coupon_code = '';
        this.placing_order = false;
    },
    async send(order_data) {
        this.placing_order = true;
        const res = await uchipRequest.post('order/create', {
            ...order_data,
            items: this.itemsDetail4Order,
            tip_amount: this.tip_amount,
            payment_method: this.payment_method,
            coupon_code: this.coupon_code,
        });
        if (res?.status === 'success') {
            this.reset();
            this.current_order = res.order_id;
            return res;
        } else {
            this.setError('An error ocurred.');
        }
        this.placing_order = false;
        return false;
    },
    async preCheck(onChecked) {
        this.checking_order = true;
        const res = await uchipRequest.post('order/check', {
            items: this.itemsDetail4Order
        });
        if (res?.status === 'success') {
            onChecked();
        } else {
            this.setError('An error ocurred.');
        }
        this.checking_order = false;
        return false;
    },
    async checkCoupon() {
        if (this.coupon_code != ''){
            this.checking_coupon = true;
            const res = await uchipRequest.get('order/coupon/check', {
                coupon_code: this.coupon_code,
                order_total: this.itemsDetail.reduce((total, item) => {
                    return total + item.total;
                }, 0)
            });
            if (res?.status === 'success') {
                this.coupon_discount = res.discount;
            } else {
                this.setError('An error ocurred.');
            }
            this.checking_coupon = false;
        }
    },
    setTipAmount(amount) {
        this.tip_amount = amount;
    },
    plusProductByIndex(index_item) {
        if (this.items[index_item].sell.qty < 10) {
            this.items[index_item].sell.qty++;
        }
        updateOrderLocalStorage(this.items);
    },
    removeProductByIndex(index_item) {
        const _length = this.items.length
        //console.log(this.items.slice(0, index_item),'AQUI');
        //console.log(this.items.slice(0, index_item).concat(this.items.slice(index_item + 1)));
        this.items = this.items.slice(0, index_item).concat(this.items.slice(index_item + 1));
        updateOrderLocalStorage(this.items);
    },
    setError(mess) {
        this.error_message = mess;
        console.log(this.error_message, 'BENO PS');
    },
    addItem(product_featured) {
        this.items.push({
            id: product_featured.id,
            name: product_featured.name,
            image: product_featured.image,
            sell: product_featured.sell
        });
        updateOrderLocalStorage(this.items);
    },
    async loadOrderConfig() {
        try {
            const data = await uchipRequest.get('orders/config');
            if (data.status == 'success') {
                this.configuration = data.config;
            }
        }
        catch (error) {
            console.log(error)
        }
    },
    loadFromStorage() {
        //TODO: Add Address, payment and other fields related to order store
        const items_stored = localStorage.getItem("order_items");
        this.items = items_stored !== null && items_stored != '' ? JSON.parse(items_stored) : [];
    },
    setPreviewState(new_state) {
        this.show_preview = new_state;
    }
};