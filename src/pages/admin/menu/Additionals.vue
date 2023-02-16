<template>
    <div class="row admin-menu-product-item-additionals" style="padding-top:20px;">
        <div class="col-1">
            <h5>Adicionales:</h5>
        </div>
        <div class="col-11">
            <div v-if="productAdditionals.length == 0">
                <q-chip square>
                    <div>Acompanantes premium.</div>
                </q-chip>
                <q-chip square>
                    <div>Elige tus salsas.</div>
                </q-chip>
            </div>
            <draggable v-else v-model="productAdditionals" :group="'addtionals_product_' + productAdditionals.id"
                @start="drag = true" @end="drag = false" item-key="id">
                <template #item="{ element }">
                    <AdminAdditionalInProduct :element="element"/>
                </template>
            </draggable>
            <div class="admin-menu-additional-item-add">
                <q-btn 
                    outline 
                    @click="showDialog()"
                    color="primary" 
                    round 
                    size="sm" 
                    icon="fa-solid fa-plus" />
            </div>
        </div>
    </div>
</template>

<script>
import draggable from 'vuedraggable'
import { ref } from 'vue'
import { useAdminMenuStore } from 'stores/admin_menu'
import { useAdminAdditionalsStore } from 'stores/admin_additionals';
import AdminAdditionalInProduct from './AdditionalInProduct.vue';
export default {
    name: 'AdminProductAdditionals',
    props: ['productItem'],
    components: {
        draggable,
        AdminAdditionalInProduct
    },
    computed: {
        productAdditionals: {
            get() {
                return this.productItem.additionals
            },
            set(neworder) {
                this.uAMenuStore.updateProductAdditionalsOrder(this.productItem.category_id, this.productItem.id, neworder);
                //this.$store.commit('updateList', value)
            }
        },
    },
    methods: {
        showDialog(category_id) {
            if (this.addStore.additional_list.length === 0) {
                this.addStore.loadData();
            }
            console.log(this.productItem);
            this.addStore.showProductDialog({
                ...this.productItem,
                category_display: category_id !== undefined ? category_id : null
            });
        },
    },
    provide() {
        return {
            pItem: this.productItem
        }
    },
    setup() {
        const uAMenuStore = useAdminMenuStore();
        const addStore = useAdminAdditionalsStore();
        //uAMenuStore.loadMenuInformation();
        return {
            uAMenuStore,
            addStore
        }
    }
}
</script>