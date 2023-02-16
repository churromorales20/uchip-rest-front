<template>
    <q-dialog ref="_delete_confirm_dialog_" v-model="showDeleteConfirm" persistent>
        <q-card class="admin-modal-confirm">
            <q-card-section class="row items-center">
                <h3>Atencion</h3>
                <h4>Estas a punto de eliminar la categoria <b>{{ categoryElement.name }}</b></h4>
                <h5>Tambien se eleiminaran los procuctos asociados, esta accion no podra deshacerse</h5>
                <h5>Por favor confirma que desas continuar?</h5>
            </q-card-section>
            <q-card-actions align="right">
                <q-btn 
                    flat 
                    label="Cancel"
                    :disable="deletingCategory"
                    color="admin-warning" 
                    v-close-popup />
                <q-btn 
                    :loading="deletingCategory"
                    :disable="deletingCategory"
                    label="Continuar (Borrar)" 
                    outline  
                    color="admin-warning" 
                    @click="confirmedmCategoryDeletion()"/>
            </q-card-actions>
        </q-card>
    </q-dialog>
    <q-expansion-item :expand-icon-toggle="true" class="admin-menu-category-item">
        <template v-slot:header>
            <div class="admin-menu-category-item-header">
                <q-icon name="fa-solid fa-grip" color="admin-default"></q-icon>
                <div class="admin-menu-category-item-header-name">
                    <q-input 
                        filled 
                        v-model="name" 
                        color="admin-light" 
                        label="Nombre de la categoria:" 
                        maxlength="40" 
                        :dense="true"
                        stack-label />
                    <div class="admin-menu-category-item-header-inputcounter">{{ name.length }}/40</div>
                </div>
                <q-btn 
                    outline 
                    :loading="changingStatus" 
                    :disable="changingStatus" 
                    :color="categoryElement.deleted_at === null ? 'positive' : 'admin-error'"
                    @click="changeStatus()" 
                    size="sm" 
                    :icon="categoryElement.deleted_at === null ? 'fa-solid fa-check' : 'fa-solid fa-ban'" 
                    :label="categoryElement.deleted_at === null ? 'Disponible' : 'No disponible'" />
                <q-btn 
                    outline 
                    :disable="changingStatus" 
                    color="admin-default" 
                    @click="confirmCategoryDeletion()" 
                    size="sm" 
                    icon="fa-solid fa-trash" 
                    class="q-ml-sm q-mr-sm" />
            </div>
        </template>
        <div class="admin-menu-category-item-content">
            <draggable v-model="productsList" :group="'category_menu_' + categoryElement.id" @start="drag = true" @end="drag = false" item-key="id">
                <template #item="{ element }">
                    <li>
                        <AdminProduct :categoryId="categoryElement.id" :productItem="element">
                        </AdminProduct>
                    </li>
                </template>
            </draggable>
            <q-btn 
                color="positive"
                @click="addNewProduct"
                :loading="addingProduct"
                :disable="addingProduct"
                icon="fa-solid fa-plus" 
                label="Agregar producto" />
        </div>
    </q-expansion-item>
</template>

<script>
import draggable from 'vuedraggable'
import { ref } from 'vue'
import { useAdminMenuStore } from 'stores/admin_menu'
import AdminProduct from './menu/Product.vue';
export default {
    name: 'AdminMenuCategory',
    props: ['categoryElement'],
    components:{
        draggable,
        AdminProduct
    },
    computed: {
        productsList: {
            get() {
                return this.categoryElement.products;
            },
            set(newMap) {
                this.uAMenuStore.setCategoryProductsMap(this.categoryElement.id, newMap);
            }
        },
        name: {
            get() {
                return this.categoryElement.name;
            },
            set(newName) {
                this.uAMenuStore.setCategoryName(this.categoryElement.id, newName);
                //this.$store.commit('updateList', value)
            }
        },
    },
    methods: {
        confirmCategoryDeletion(){
            this.showDeleteConfirm = true;
        },
        async confirmedmCategoryDeletion(){
            this.deletingCategory = true;
            await this.uAMenuStore.deleteCategory(this.categoryElement.id);
            this.showDeleteConfirm = false;
            this.deletingCategory = false;
        },
        async addNewProduct(){
            this.addingProduct = true;
            await this.uAMenuStore.addNewProduct(this.categoryElement.id);
            this.addingProduct = false;
        },
        async changeStatus(){
            this.changingStatus = true;
            await this.uAMenuStore.changeCategoryStatus(this.categoryElement.id);
            //this.$refs._delete_confirm_dialog_.hide()
            this.changingStatus = false;
        },
    },
    setup() {
        const uAMenuStore = useAdminMenuStore();
        //const q = useQuasar()
        return {
            showDeleteConfirm: ref(false),
            deletingCategory: ref(false),
            changingStatus: ref(false),
            addingProduct: ref(false),
            uAMenuStore
        }
    }
}
</script>