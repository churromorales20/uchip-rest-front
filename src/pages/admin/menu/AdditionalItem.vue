<template>
    <q-expansion-item 
        :expand-icon-toggle="true" 
        popup 
        switch-toggle-side 
        :default-opened="isOpen === true"
        class="admin-menu-category-item additionals admin-additionals-item-expansion">
        <template v-slot:header>
            <div class="admin-additionals-item-header">
                
                    <div class="admin-menu-category-item-header-name">
                        <q-input filled v-model="addName" color="admin-light" label="Nombre de la categoria:" maxlength="40" :dense="true"
                            stack-label />
                        <div class="admin-menu-category-item-header-inputcounter">{{ addName.length }}/40</div>
                    </div>
                <div>
                    <q-btn-dropdown 
                        color="admin-default" 
                        split 
                        padding="1" 
                        v-model="showAssociationMenu" 
                        size="sm"
                        label="Vincular/Desvincular"
                        outline
                        class="admin-additionals-item-associator"
                        @click="showAssociationMenu = !showAssociationMenu">
                        <!--<h5 class="admin-menu-product-item-copybtn-title">Copiar en:</h5>-->
                        <div v-if="addStore.productFeatured">
                            <q-item class="admin-additionals-item-associator-option featured" clickable v-close-popup>
                                <q-checkbox v-model="productsList" :val="addStore.productFeatured.id" :label="addStore.productFeatured.name" />
                            </q-item>
                        </div>
                        <div class="admin-additionals-item-associator-normal">
                            <q-item 
                                class="admin-additionals-item-associator-option" 
                                v-for="(product) in addStore.productsList" 
                                :key="'_product_assoc_item_' +  product.id" 
                                clickable 
                                v-close-popup>
                                <q-checkbox v-model="productsList" :val="product.id" :label="product.name" />
                            </q-item>
                        </div>
                    </q-btn-dropdown>
                    <q-btn 
                        outline 
                        @click="copyAdditionalCategory()" 
                        :disable="copyingCategory"
                        :loading="copyingCategory"
                        color="admin-default" 
                        size="sm" 
                        class="q-ml-sm"
                        icon="fa-solid fa-copy" />
                    <q-btn 
                        outline 
                        @click="cofirmCategoryDeletion()" 
                        color="admin-default" 
                        size="sm" 
                        icon="fa-solid fa-trash"
                        class="q-ml-sm" />
                </div>
            </div>
        </template>
        <div class="admin-menu-category-item-content">
            <h5>Configuracion basica de la categoría</h5>
            <div class="admin-additionals-item-section">
                <span>
                    Tipo de adicional:
                </span>
                <q-radio dense v-model="addRequired" :val="false" label="Opcional" /> 
                <q-radio dense v-model="addRequired" :val="true" class="q-ml-sm" label="Obligatorio" />
            </div>
            <div class="admin-additionals-item-section">
                <span>
                    Se pueden escoger:
                </span>
                <q-radio dense v-model="addSingle" :val="true" label="Solo uno" />
                <q-radio dense v-model="addSingle" :val="false" class="q-ml-sm" label="Multiples opciones" />
            </div>
            <div v-if="addSingle === false" class="admin-additionals-item-section  quantities">
                <span>
                    Cantidad a escoger:
                </span>
                <q-input 
                    filled 
                    v-model.number="addMinOptions" 
                    color="admin-light" 
                    label="Minimio:" 
                    maxlength="40" 
                    :dense="true"
                    type="number"
                    stack-label />
                <q-input 
                    filled 
                    v-model.number="addMaxOptions" 
                    color="admin-light" 
                    label="Maximo:" 
                    maxlength="40" 
                    :dense="true"
                    type="number"
                    class="q-ml-sm"
                    stack-label />
            </div>
            <h5 v-if="optionsList.length > 0">Los adicionales de la categoria:</h5>
            <div v-if="optionsList.length > 0">
                <div class="row row admin-additionals-item-option-head">
                    <div class="col-6" style="padding-left:20px">
                        Adicional
                    </div>
                    <div class="col-2">
                        Precio
                    </div>
                    <div class="col-2">
                        Cantidad Max. 
                    </div>
                    <div class="col-2">
                    </div>
                </div>
                <draggable 
                    v-model="optionsList" 
                    :group="'_add_options_' + add.id" 
                    @start="drag = true"
                    @end="drag = false" 
                    item-key="id">
                    <template #item="{ element }">
                        <AdminAdditionalItemOption :addId="add.id" :option="element"/>
                    </template>
                </draggable>
                <div class="row">
                    <div class="col-6" style="padding-left:20px; margin-top:5px;">
                        <q-btn 
                            outline 
                            color="positive" 
                            @click="addNewOption()"
                            :loading="adding"
                            :disable="adding" 
                            size="sm" 
                            class="admin-additionals-item-option-btn"
                            icon="fa-solid fa-plus" 
                            label="Nuevo adicional" />
                    </div>
                </div>
            </div>
            <div class="admin-additionals-item-option-empty" v-else>
                    <h5>Aún no has agregado adcionales a esta categoría.</h5>
                <q-btn outline color="positive" @click="addNewOption()" :loading="adding" :disable="adding" size="md"
                    icon="fa-solid fa-plus" label="Nuevo adicional" />
            </div>
        </div>
    </q-expansion-item>
</template>

<script>
import draggable from 'vuedraggable'
import { ref } from 'vue'
//import { useAdminMenuStore } from 'stores/admin_menu'
import { useAdminAdditionalsStore } from 'stores/admin_additionals';
import AdminAdditionalItemOption from './AdditionalItemOption.vue';
export default {
    name: 'AdminAdditionalItem',
    props: ['add', 'isOpen'],
    components: {
        AdminAdditionalItemOption,
        draggable
    },
    computed: {
        productsList: {
            get() {
                return this.add.products;
            },
            set(newval) {
                //console.log(newval);
                this.addStore.productsAssociation({
                    id: this.add.id,
                    name: this.add.name
                }, newval);
            }
        },
        optionsList: {
            get() {
                return this.add.items_data.map((opt, key) => {
                    return {
                        ...opt,
                        index: key
                    }
                }).sort((optA, optB) => {
                    if (optA.order < optB.order) {
                        return -1;
                    }
                    if (optA.order > optB.order) {
                        return 1;
                    }
                    return 0;
                });
            },
            set(newval) {
                this.addStore.setCategoryOptionsMap(this.add.id, newval);
            }
        },
        addMinOptions: {
            get() {
                return this.add.min_items;
            },
            set(newval) {
                //console.log(newval);
                this.addStore.updateOptionsQty(this.add.id, newval == '' ? 0 : newval, 'min');
            }
        },
        addMaxOptions: {
            get() {
                return this.add.max_items;
            },
            set(newval) {
                //console.log(newval);
                this.addStore.updateOptionsQty(this.add.id, newval == '' ? 0 : newval, 'max');
            }
        },
        addRequired: {
            get() {
                return this.add.required;
            },
            set(newval) {
                console.log(newval);
                this.addStore.updateBehavior(this.add.id, newval, 'req');
            }
        },
        addSingle: {
            get() {
                console.log('REQ', this.add.single);
                return this.add.single;
            },
            set(newval) {
                console.log(newval);
                this.addStore.updateBehavior(this.add.id, newval, 'sin');
            }
        },
        addName: {
            get() {
                return this.add.name;
            },
            set(newval) {
                this.addStore.updateName(this.add.id, newval);
            }
        },
    },
    methods: {
        async addNewOption() {
            this.adding = true;
            await this.addStore.addNewOption(this.add.id);
            this.adding = false;
        },
        cofirmCategoryDeletion(){
            this.addStore.showConfirmDialog({
                name: this.add.name,
                id: this.add.id,
                type: 'category',
            });
        },
        async copyAdditionalCategory(){
            this.copyingCategory = true;
            await this.addStore.duplicateCategory(this.add.id);
            this.copyingCategory = false;
        }
    },
    setup() {
        //const uAMenuStore = useAdminMenuStore();
        const addStore = useAdminAdditionalsStore();
        //uAMenuStore.loadMenuInformation();
        return {
            //uAMenuStore,
            addStore,
            adding: ref(false),
            copyingCategory: ref(false),
            showAssociationMenu: ref(false),
        }
    }
}
</script>