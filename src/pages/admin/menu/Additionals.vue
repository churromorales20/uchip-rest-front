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
                    <div class="admin-menu-additional-item">
                        <q-chip square icon="fa-solid fa-grip-vertical">
                            <div class="admin-menu-additional-item-name">{{ element.name }}</div>
                            <q-btn outline class="text-admin-default q-ml-sm" size="xs" padding="0"
                                icon="fa-solid fa-gears" />
                            <q-btn outline size="xs" padding="0" icon="fa-solid fa-trash"
                                class="text-admin-default q-ml-sm" />
                        </q-chip>
                    </div>
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
export default {
    name: 'AdminProductAdditionals',
    props: ['productItem'],
    components: {
        draggable
    },
    computed: {
        productAdditionals: {
            get() {
                return this.productItem.additionals;
            },
            set(newName) {
                //this.uAMenuStore.updateProductName(this.categoryId, this.productItem.id, newName);
                //this.$store.commit('updateList', value)
            }
        },
    },
    methods: {
        showDialog(){
            if (this.addStore.additional_list.length === 0) {
                this.addStore.loadData();
            }
            this.addStore.showProductDialog(this.productItem);
        }
    },
    setup() {
        const uAMenuStore = useAdminMenuStore();
        const addStore = useAdminAdditionalsStore();
        //uAMenuStore.loadMenuInformation();
        return {
            uAMenuStore,
            addStore
            //changingStatus: ref(false),
        }
    }
}
</script>