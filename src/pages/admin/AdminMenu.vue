<template>
    <div v-if="uAMenuStore.loading" class="admin-main-wrapper">
        <q-circular-progress indeterminate size="200px" :thickness="0.1" rounded color="secondary" track-color="grey-3"
            class="q-ma-md" />
    </div>
    <div v-else>
        <q-dialog ref="_delete_product_confirm_dialog_" v-model="showDeleteProduct" persistent>
            <q-card class="admin-modal-confirm">
                <q-card-section class="row items-center">
                    <h3>Atencion</h3>
                    <h4>Estas a punto de eliminar el producto <b>{{ uAMenuStore.itemToDeletelete.name }}</b></h4>
                    <h5>Por favor confirma que desas continuar?</h5>
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn flat label="Cancel" :disable="deletingProduct" color="admin-warning" v-close-popup />
                    <q-btn :loading="deletingProduct" :disable="deletingProduct" label="Continuar (Borrar)" outline
                        color="admin-warning" @click="confirmedProductDeletion()" />
                </q-card-actions>
            </q-card>
        </q-dialog>
        <AdminAdditionalsDialog />
        <ProductImageSelector />
        <AdminBreadCrumbs />
        <div class="admin-module-container">
            <h5 class="admin-module-title">
                Tu menu
            </h5>
            <draggable 
                class="list-group"
                item-key="order"
                group="categories_menu"
                :component-data="{ tag: 'ul', name: 'flip-list', type: 'transition' }"
                v-model="categoriesList"
                v-bind="dragOptions"
                @start="isDragging = true"
                @end="isDragging = false" >
                <template #item="{ element }">
                    <li class="list-group-item">
                        <AdminMenuCategory :categoryElement="element"></AdminMenuCategory>
                    </li>
                </template>
            </draggable>
            <div>
                <q-btn outline color="positive" @click="uAMenuStore.createNewCategory()" :loading="uAMenuStore.creating_category"
                    :disable="uAMenuStore.creating_category" size="md" icon="fa-solid fa-plus" label="Nueva categoria" />
            </div>
        </div>
    </div>
    
</template>

<script>
import draggable from 'vuedraggable'
import { ref } from 'vue'
import { useAdminMenuStore } from 'stores/admin_menu'
import AdminMenuCategory from './AdminMenuCategory.vue';
import ProductImageSelector from './menu/ProductImageSelector.vue';
import AdminAdditionalsDialog from './menu/AdditionalsDialog.vue';
import AdminBreadCrumbs from '../../components/admin/BreadCrumbs.vue';
export default {
    name: 'AdminMenu',
    displayName: 'AdminMenu',
    components:{
        draggable,
        AdminMenuCategory,
        AdminAdditionalsDialog,
        ProductImageSelector,
        AdminBreadCrumbs
    },
    computed: {
        dragOptions() {
            return {
                animation: 0,
                group: "description",
                disabled: false,
                ghostClass: "ghost"
            };
        },
        categoriesList: {
            get() {
                return this.uAMenuStore.menuCategories;
            },
            set(newMap) {
                this.uAMenuStore.setCategoriesMap(newMap);
                //this.$store.commit('updateList', value)
            }
        },
        showDeleteProduct: {
            get() {
                return this.uAMenuStore.toDeleteleteConfirm;
            },
            set() {
                this.uAMenuStore.setProductToDelete(null);
                //this.$store.commit('updateList', value)
            }
        }
    },
    methods:{
        async confirmedProductDeletion() {
            this.deletingProduct = true;
            await this.uAMenuStore.deleteProduct();
            this.deletingProduct = false;
        },
    },
    setup() {
        const uAMenuStore = useAdminMenuStore();
        uAMenuStore.loadMenuInformation();
        return {
            uAMenuStore,
            deletingProduct: ref(false),
            drag: ref(false),
        }
    }
}
</script>
<style>
.flip-list-move {
    transition: transform 0.5s;
}

.no-move {
    transition: transform 0s;
}

.ghost {
    opacity: 0.5;
    background: #c8ebfb;
}

.list-group {
    min-height: 20px;
}
.list-group li{
    list-style: none;
}
.list-group-item {
    cursor: move;
}

.list-group-item i {
    cursor: pointer;
}</style>