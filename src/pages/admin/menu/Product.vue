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
                    <q-btn outline color="positive" size="sm" icon="fa-solid fa-check" label="Disponible" />
                    <q-btn outline color="admin-default" size="sm" icon="fa-solid fa-copy" class="q-ml-sm"/>
                    <q-btn outline color="admin-default" size="sm" icon="fa-solid fa-trash" class="q-ml-sm" />
                </div>
            </div>
            <div class="row">
                <div class="col-md-7" style="padding-top:10px;">
                    <q-input v-model="productDescription" label="Descripcion:" rows="4" :dense="true" filled type="textarea" stack-label/>
                </div>
            </div>
            <div class="row" style="padding-top:10px;">
                <div class="col-md-2">
                    <q-input v-model.number="price" type="number" label="Precio:" :dense="true" filled stack-label>
                        <template v-slot:prepend>
                            <span class="admin-menu-product-item-currencyinput">S/.</span>
                        </template>
                    </q-input>
                </div>
                <div class="col-md-2" style="padding-left:10px;">
                    <q-input v-model="priceDiscount" label="Precio con descuento    :" :dense="true" filled stack-label>
                        <template v-slot:prepend>
                            <span class="admin-menu-product-item-currencyinput">S/.</span>
                        </template>
                        <template v-if="priceDiscount != ''" v-slot:append>
                            <q-icon name="close" @click="text = ''" class="cursor-pointer" />
                        </template>
                    </q-input>
                </div>
            </div>
            <div class="row admin-menu-product-item-additionals" style="padding-top:20px;">
                <div class="col-1">
                    <h5>Adicionales:</h5>
                </div>
                <div class="col-11">
                    <draggable v-model="productAdditionals" :group="'addtionals_product_' + productAdditionals.id" @start="drag = true"
                        @end="drag = false" item-key="id">
                        <template #item="{ element }">
                            <div class="admin-menu-additional-item">
                                <q-chip icon="fa-solid fa-grip-vertical">
                                    <div class="admin-menu-additional-item-name">{{ element.name }}</div>
                                    <q-btn outline class="text-admin-default q-ml-sm" size="xs" padding="0" icon="fa-solid fa-gears" />
                                    <q-btn outline size="xs" padding="0" icon="fa-solid fa-trash" class="text-admin-default q-ml-sm" />
                                </q-chip>
                            </div>
                        </template>
                    </draggable>
                    <div :class="productAdditionals.length > 0 ? 'admin-menu-additional-item-add' : ''">
                        <q-btn outline color="primary" round size="sm" icon="fa-solid fa-plus" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import draggable from 'vuedraggable'
import { ref } from 'vue'
import { useAdminMenuStore } from 'stores/admin_menu'
export default {
    name: 'AdminProduct',
    props: ['categoryId','productItem'],
    components:{
        draggable
    },
    computed: {
        productName: {
            get() {
                return this.productItem.name;
            },
            set(newName) {
                this.uAMenuStore.updateProductName(this.categoryId, this.productItem.id, newName);
                //this.$store.commit('updateList', value)
            }
        },
        productDescription: {
            get() {
                return this.productItem.description;
            },
            set(newName) {
                //this.uAMenuStore.updateProductName(this.categoryId, this.productItem.id, newName);
                //this.$store.commit('updateList', value)
            }
        },  
        price: {
            get() {
                return this.productItem.price;
            },
            set(newName) {
                //this.uAMenuStore.updateProductName(this.categoryId, this.productItem.id, newName);
                //this.$store.commit('updateList', value)
            }
        },
        priceDiscount: {
            get() {
                return this.productItem.price_discount === null ? '' : this.productItem.price_discount;
            },
            set(newName) {
                //this.uAMenuStore.updateProductName(this.categoryId, this.productItem.id, newName);
                //this.$store.commit('updateList', value)
            }
        },
        productAdditionals: {
            get() {
                return this.productItem.additionals;
            },
            set(newName) {
                //this.uAMenuStore.updateProductName(this.categoryId, this.productItem.id, newName);
                //this.$store.commit('updateList', value)
            }
        },
        /*{{categoryItem.name}}() {
            return this.uAMenuStore.menuCategories[this.categoryIndex];
        }*/
    },
    setup() {
        const uAMenuStore = useAdminMenuStore();
        //uAMenuStore.loadMenuInformation();
        return {
            uAMenuStore
        }
    }
}
</script>