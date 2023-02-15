<template>
    <q-dialog 
        full-height
        @hide="mainDialogHide"
        ref="_product_additionals_dialog_" 
        v-model="showDialog" :persistent="false">
        <q-card class="admin-modal-additionals">
            <q-card-section>
                <div v-if="addStore.isDataLoading" class="admin-modal-additionals-loader">
                    <q-circular-progress 
                        indeterminate 
                        size="100px" 
                        :thickness="0.1" 
                        rounded 
                        color="secondary" 
                        track-color="grey-3" />
                </div>
                <div class="admin-additionals-container" v-else>
                    <div  class="admin-additionals-header">
                        <h3>Categorias de adicionales.</h3>
                        <q-btn 
                            color="positive" 
                            icon="fa-solid fa-plus" 
                            :loading="addingCat"
                            :disable="addingCat"
                            @click="addNewAdditionalCategory()"
                            label="Nueva categoria" />
                    </div>
                    <div v-if="addStore.thereIsNewCategory">
                        <AdminAdditionalItem :isOpen="true" :add="addStore.newCategoryItem" />
                    </div>
                    <div v-for="(add, add_index) in addStore.list" :key="'_add_category_item_' + add_index + '_'" clickable v-ripple>
                        <h5 v-if="add.list_type === 'title'">{{ add.title }}</h5>
                        <p class="admin-additionals-not-linked" v-else-if="add.list_type === 'not_linked'">Aun no se ha vinculado este producto con ninguna categoria de adicionales.</p>
                        <AdminAdditionalItem v-else :add="add" />
                    </div>
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>
    <q-dialog 
        ref="_addtiionals_delete_confirm_dialog_" 
        v-model="showDeleteConfirm" 
        persistent>
        <q-card class="admin-modal-confirm">
            <q-card-section class="items-center">
                <h3>Atencion</h3>
                <h5>Estas a punto de eliminar {{ addStore.itemDeleting.type === 'category' ? 'la categoria' : 'la opcion' }}:</h5>
                <h4><b>{{ addStore.itemDeleting.name }}</b></h4>
                <h5>Esta accion no podra deshacerse, por favor confirma que desas continuar?</h5>
            </q-card-section>
            <q-card-actions align="right">
                <q-btn flat label="Cancel" :disable="deletingItem" color="admin-warning" v-close-popup />
                <q-btn 
                    :loading="deletingItem" 
                    :disable="deletingItem" 
                    label="Continuar (Borrar)" 
                    outline
                    color="admin-warning" 
                    @click="confirmedDeletion()" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>
import { ref } from 'vue'
import { useAdminMenuStore } from 'stores/admin_menu'
import { useAdminAdditionalsStore } from 'stores/admin_additionals';
import AdminAdditionalItem from './AdditionalItem.vue';
export default {
    name: 'AdminAdditionalsDialog',
    components: {
        AdminAdditionalItem
    },
    computed: {
        showDialog: {
            get() {
                return this.addStore.isShowingDialog;
            },
            set(newName) {
                this.addStore.showProductDialog(null);
            }
        },
        showDeleteConfirm: {
            get() {
                return this.addStore.isShowingConfirmDialog;
            },
            set(newName) {
                this.addStore.showConfirmDialog(null);
            }
        },
    },
    methods: {
        mainDialogHide(){
            this.thereIsNewCategory = false;
            this.addStore.resetNewCategory();
        },
        async addNewAdditionalCategory(){
            this.addingCat = true;
            await this.addStore.addNewAdditionalCategory();
            if (this.addStore.lastTransactionOk){
                this.thereIsNewCategory = true;
            }
            this.addingCat = false;
        },
        async confirmedDeletion(){
            this.deletingItem = true;
            await this.addStore.delete();
            //TODO: VALIDATE TRANSANCTION
            this.addStore.showConfirmDialog(null);
            this.deletingItem = false;
        }
    },
    setup() {
        //const uAMenuStore = useAdminMenuStore();
        const addStore = useAdminAdditionalsStore();
        //uAMenuStore.loadMenuInformation();
        return {
            //uAMenuStore,
            addStore,
            thereIsNewCategory: ref(false),
            addingCat: ref(false),
            deletingItem: ref(false),
        }
    }
}
</script>