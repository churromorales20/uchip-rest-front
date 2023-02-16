<template>
    <div class="admin-menu-additional-item">
        <q-chip square icon="fa-solid fa-grip-vertical">
            <div class="admin-menu-additional-item-name">{{ element.name }}</div>
            <q-btn 
                outline 
                class="text-admin-default q-ml-sm" 
                @click="showDialog(element.id)" 
                size="xs" padding="0"
                :disable="deletingItem"
                icon="fa-solid fa-gears" />
            <q-btn 
                outline 
                size="xs" 
                @click="disassociateProductAdditional(element.id)" 
                padding="0"
                icon="fa-solid fa-trash" 
                :disable="deletingItem"
                :loading="deletingItem"
                class="text-admin-default q-ml-sm" />
        </q-chip>
    </div>
</template>

<script>
//import draggable from 'vuedraggable'
import { ref } from 'vue'
import { useAdminMenuStore } from 'stores/admin_menu'
import { useAdminAdditionalsStore } from 'stores/admin_additionals';
export default {
    name: 'AdminAdditionalInProduct',
    props: ['element'],
    components: {
        //draggable
    },
    inject: ['pItem'],
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
        showDialog(category_id) {
            if (this.addStore.additional_list.length === 0) {
                this.addStore.loadData();
            }
            this.addStore.showProductDialog({
                ...this.pItem,
                category_display: category_id !== undefined ? category_id : null
            });
        },
        async disassociateProductAdditional(addtional_id) {
            this.deletingItem = true;
            await this.uAMenuStore.removeProductAssociation(this.pItem.id, addtional_id);
            this.deletingItem = false;
        }
    },
    setup() {
        const uAMenuStore = useAdminMenuStore();
        const addStore = useAdminAdditionalsStore();
        //uAMenuStore.loadMenuInformation();
        return {
            uAMenuStore,
            addStore,
            deletingItem: ref(false),
        }
    }
}
</script>