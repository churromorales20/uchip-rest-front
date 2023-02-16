<template>
    <div v-for="(category, index_category) in pStore.products_map" :key="index_category">
        <h4 class="artisan-category-title">{{ category.name }}</h4>
        <div class="row artisan-products">
            <div class="col-12 col-md-6" v-for="(product, index_product) in category.products" :key="index_product">
                <div class="artisan-products-item">
                    <div class="artisan-products-item-image">
                        <q-img v-if="product.image != ''" :src="$images_path + product.image">
                            <template v-slot:error>
                                <div class="absolute-full flex flex-center admin-menu-product-item-image-error">
                                    <q-icon name="fa-solid fa-circle-exclamation" />
                                    <h5>Error cargando imagen</h5>
                                </div>
                            </template>
                        </q-img>
                        <div v-else class="flex flex-center admin-menu-product-item-image-uploader">
                            <q-icon name="fa-solid fa-cloud-arrow-up" />
                            <h5>Cagar imagen</h5>
                        </div>
                    </div>
                    <div class="artisan-products-item-description">
                        <div class="artisan-products-item-header">
                            <h5 class="artisan-product-title">{{ product.name }}</h5>
                            <span v-if="product.price_discount !== null"
                                class="artisan-product-title-discount">{{ percentDiscount(product) }}</span>
                        </div>
                        <p class="artisan-products-item-description-p">{{ product.description }}</p>
                        <div class="artisan-products-item-footer">
                            <div class="artisan-products-item-prices">
                                <div v-if="product.price_discount !== null">
                                    <span class="artisan-products-price-discount" color="primary">S/. {{
                                        product.price_discount
                                    }}</span>
                                    <span class="artisan-products-price-discount-normal" color="secondary">S/.
                                        {{ product.price }}</span>
                                </div>
                                <div v-else>
                                    <span class="artisan-products-price" color="primary">S/. {{ product.price }}</span>
                                </div>
                            </div>
                            <q-btn @click="showProduct(product)" push color="accent" round
                                icon="fa-regular fa-plus" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { defineComponent } from 'vue'
import { useProductsStore } from 'stores/products';
import { useOrdersStore } from 'stores/orders';
export default defineComponent({
    name: 'HomeProducts',
    methods: {
        showProduct(product) {
            this.pStore.serProductViewing({ ...product});
        },
        percentDiscount: function (product) {
            return '-' + Math.ceil((((product.price - product.price_discount) * 100) / product.price)) + '%';
        }
    },
    setup() {
        const oStore = useOrdersStore();
        const pStore = useProductsStore();
        return {
            pStore,
            oStore
        }
    }
})
</script>