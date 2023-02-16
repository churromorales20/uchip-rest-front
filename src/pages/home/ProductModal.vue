<template>
    <q-dialog v-model="pStore.product_viewing">
        <q-card class="artisan-product-modal">
            <q-card-section>
                <div class="artisan-product-section">
                    <div class="artisan-product-item-image">
                        <q-img v-if="pStore.product_featured.image != ''" :src="$images_path + pStore.product_featured.image">
                            <template v-slot:error>
                                <div class="absolute-full flex flex-center admin-menu-product-item-image-error">
                                    <q-icon name="fa-solid fa-circle-exclamation" />
                                    <h5>Error cargando imagen</h5>
                                </div>
                            </template>
                        </q-img>
                        <div v-else class="flex flex-center admin-menu-product-item-image-uploader">
                            <q-icon name="fa-solid fa-cloud-arrow-up" />
                        </div>
                    
                    </div>
                    <div class="artisan-product-container">
                        <div class="artisan-product-title">
                            <h2>{{ pStore.product_featured.name }}</h2>
                            <q-btn icon="close" flat round dense v-close-popup />
                        </div>
                        <div class="artisan-product-content">
                            <p>{{ pStore.product_featured.description }}</p>
                            <div class="artisan-product-price">
                                <template v-if="pStore.product_featured.price_discount !== null">
                                    <span class="artisan-products-price-discount" color="primary">S/. {{ pStore.product_featured.price_discount }}</span>
                                    <span class="artisan-products-price-discount-normal" color="secondary">S/. {{ pStore.product_featured.price }}</span>
                                    <span class="artisan-product-title-discount">{{ percentDiscount(pStore.product_featured) }}</span>
                                </template>
                                <template v-else>
                                    <span class="artisan-products-price" color="primary">S/. {{ pStore.product_featured.price }}</span>
                                </template>
                            </div>
                            <ProductAdditionals />
                            <div class="product-fields-comments">
                                <h6>Comentarios</h6>
                                <q-input 
                                    v-model="pStore.product_featured.sell.comments" 
                                    :dense="true" 
                                    type="textarea" />
                            </div>
                        </div>
                        <div class="artisan-product-totalizer">
                            <div class="artisan-product-totalizer-selector">
                                <q-btn @click="minusBtnAction()" size="sm" push color="accent" round icon="fa-solid fa-minus" />
                                <q-input v-model.number="pStore.product_featured.sell.qty" type="number" filled />
                                <q-btn @click="plusBtnAction()" size="sm" push color="green" round icon="fa-regular fa-plus" />
                            </div>
                            <q-btn color="primary" @click="addProduct()" :label="'Agregar S/. ' + pStore.productFeaturedTotal" />
                        </div>
                    </div>
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>
<script>
import { defineComponent } from 'vue'
import { useProductsStore } from 'stores/products';
import { useOrdersStore } from 'stores/orders';
import ProductAdditionals from './ProductAdditionals.vue'
export default defineComponent({
    name: 'ProductModal',
    components: {
        ProductAdditionals
    },
    methods: {
        percentDiscount: function (product) {
            return '-' + Math.ceil((((product.price - product.price_discount) * 100) / product.price)) + '%';
        },
        minusBtnAction(){
            this.pStore.minusQtySell();
        },
        plusBtnAction(){
            console.log('ITEMS BEFORE', this.oStore.items);
            this.pStore.plusQtySell();
            console.log('ITEMS AFTER', this.oStore.items);
        },
        async addProduct(){
            if(await this.pStore.isProductValidForSell()){
                let cerca = JSON.parse(JSON.stringify(this.pStore.product_featured));
                console.log('CERCA', cerca);
                this.oStore.addItem(cerca);
                this.pStore.serProductViewing(null);
            }
        }
    },
    setup() {
        const pStore = useProductsStore();
        const oStore = useOrdersStore();
        return {
            pStore,
            oStore
        }
    }
})
</script>