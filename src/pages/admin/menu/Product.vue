<template>
    <div class="admin-menu-product-item row">
        <div class="col-1">
            <div 
                class="admin-menu-product-item-image"
                :style="{ 'background-image': 'url(' + $images_path + productItem.image + ')' }">
            </div>
        </div>
        <div class="col-11">
            <div class="row admin-menu-product-item-header">
                <div class="col-md-3 admin-menu-product-item-nameinput">
                    <q-input filled v-model="productName" label="Nombre del producto:" maxlength="40" :dense="true" stack-label />
                    <div class="admin-menu-product-item-inputcounter">{{ productName.length }}/40</div>
                </div>
                <div class="col-md-9">
                    <q-btn 
                        outline 
                        :loading="changingStatus" 
                        :disable="changingStatus" 
                        :color="productItem.deleted_at === null ? 'positive' : 'admin-error'"
                        size="sm" 
                        @click="changeStatus()" 
                        :icon="productItem.deleted_at === null ? 'fa-solid fa-check' : 'fa-solid fa-ban'" 
                        :label="productItem.deleted_at === null ? 'Disponible' : 'No disponible'" />
                    <!--<q-btn outline color="admin-default" size="sm" icon="fa-solid fa-copy" class="q-ml-sm"/>-->
                    <q-btn-dropdown 
                        color="admin-default"
                        split
                        padding="1" 
                        v-model="showCopyMenu"
                        size="sm"
                        :loading="copyingProduct" 
                        :disable="copyingProduct" 
                        outline 
                        icon="fa-solid fa-copy" 
                        class="q-ml-sm" 
                        @click="showCopyMenu = !showCopyMenu">
                        <h5 class="admin-menu-product-item-copybtn-title">Copiar en:</h5>
                        <q-list>
                            <q-item 
                                v-for="(cat, cat_index) in uAMenuStore.categoriesCopy" 
                                :key="'_cat_selector_item_' + cat_index + '_' + productItem.id" 
                                clickable 
                                v-close-popup 
                                @click="copyProduct(cat.id)">
                                {{ cat.name }}
                            </q-item>
                        </q-list>
                    </q-btn-dropdown>
                    <q-btn 
                        outline 
                        @click="confirmProductDeletion()"
                        color="admin-default" 
                        size="sm" 
                        icon="fa-solid fa-trash" 
                        class="q-ml-sm" />
                </div>
            </div>
            <div class="row">
                <div class="col-md-7" style="padding-top:10px;">
                    <q-input v-model="productDescription" label="Descripcion:" rows="4" :dense="true" filled type="textarea" stack-label/>
                </div>
            </div>
            <div class="row" style="padding-top:10px;">
                <div class="col-md-2">
                    <q-input v-model.number="price" class="admin-menu-product-item-price" type="number" label="Precio:" :dense="true" filled stack-label>
                        <template v-slot:prepend>
                            <span class="admin-menu-product-item-currencyinput">S/.</span>
                        </template>
                    </q-input>
                </div>
                <div class="col-md-2" style="padding-left:10px;">
                    <q-input v-model.number="priceDiscount" class="admin-menu-product-item-price" type="number" label="Precio con descuento:" :dense="true" filled stack-label>
                        <template v-slot:prepend>
                            <span class="admin-menu-product-item-currencyinput">S/.</span>
                        </template>
                        <template v-if="priceDiscount != ''" v-slot:append>
                            <q-icon name="close" @click="deleteDiscount()" class="cursor-pointer" />
                        </template>
                    </q-input>
                </div>
            </div>
            <AdminProductAdditionals :productItem="productItem"/>
        </div>
    </div>
</template>

<script>
import draggable from 'vuedraggable'
import { ref } from 'vue'
import AdminProductAdditionals from './Additionals.vue';
import { useAdminMenuStore } from 'stores/admin_menu'
export default {
    name: 'AdminProduct',
    props: ['categoryId','productItem'],
    components:{
        //draggable,
        AdminProductAdditionals
    },
    computed: {
        productName: {
            get() {
                return this.productItem.name;
            },
            set(newName) {
                this.uAMenuStore.updateProductName(this.categoryId, this.productItem.id, newName);
            }
        },
        productDescription: {
            get() {
                return this.productItem.description;
            },
            set(newDesc) {
                this.uAMenuStore.updateProductDescription(this.categoryId, this.productItem.id, newDesc);
            }
        },  
        price: {
            get() {
                return this.productItem.price;
            },
            set(newPrice) {
                this.uAMenuStore.updateProductPrice(this.categoryId, this.productItem.id, newPrice);
            }
        },
        priceDiscount: {
            get() {
                return this.productItem.price_discount === null ? '' : this.productItem.price_discount;
            },
            set(newPrice) {
                this.uAMenuStore.updateProductPrice(this.categoryId, this.productItem.id, newPrice, true);
            }
        }
    },
    methods:{
        async changeStatus() {
            this.changingStatus = true;
            await this.uAMenuStore.changeProductStatus(this.categoryId, this.productItem.id);
            //this.$refs._delete_confirm_dialog_.hide()
            this.changingStatus = false;
        },
        async copyProduct(category_id) {
            this.copyingProduct = true;
            await this.uAMenuStore.copyProductToCategory(this.productItem, category_id);
            //this.$refs._delete_confirm_dialog_.hide()
            this.copyingProduct = false;
        },
        confirmProductDeletion(){
            this.uAMenuStore.setProductToDelete({
                product_id: this.productItem.id,
                name: this.productItem.name,
                category_id: this.categoryId
            });
        },
        deleteDiscount(){
            this.uAMenuStore.updateProductPrice(this.categoryId, this.productItem.id, null, true);
        },
    },
    setup() {
        const uAMenuStore = useAdminMenuStore();
        //uAMenuStore.loadMenuInformation();
        return {
            uAMenuStore,
            changingStatus: ref(false),
            showCopyMenu: ref(false),
            copyingProduct: ref(false),
        }
    }
}
</script>