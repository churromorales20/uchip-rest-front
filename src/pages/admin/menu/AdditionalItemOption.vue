<template>
    <div class="row admin-additionals-item-option">
        <div class="col-6">
            <q-icon name="fa-solid fa-grip" color="admin-default"></q-icon>
            <div>
                <div class="admin-menu-category-item-header-name">
                    <q-input filled v-model="optName" color="admin-light" maxlength="40" :dense="true" stack-label />
                    <div class="admin-menu-category-item-header-inputcounter">{{ optName.length }}/40</div>
                </div>
            </div>
        </div>
        <div class="col-2">
            <q-input 
                filled 
                class="q-mr-sm admin-menu-product-item-price"
                v-model.number="optPrice" 
                color="admin-light" 
                maxlength="40"
                type="number"
                :dense="true" 
                stack-label />
        </div>
        <div class="col-2">
            <q-input 
            filled 
            class="q-mr-sm"
            v-model.number="optMax" 
            color="admin-light" 
            maxlength="40"
            type="number"
            :dense="true" 
            stack-label />
        </div>
        <div class="col-2">
            <q-toggle 
                v-model="optStatus" 
                checked-icon="check" 
                color="green" 
                unchecked-icon="clear" />
            <q-btn 
                outline 
                @click="cofirmOptionDeletion()" 
                color="admin-default" 
                size="sm" 
                icon="fa-solid fa-trash"
                class="q-ml-sm" />
        </div>
    </div>
</template>

<script>
//import draggable from 'vuedraggable'
import { ref } from 'vue'
//import { useAdminMenuStore } from 'stores/admin_menu'
import { useAdminAdditionalsStore } from 'stores/admin_additionals';
export default {
    name: 'AdminAdditionalItemOption',
    props: ['addId', 'option'],
    components: {
        //draggable
    },
    computed: {
        optStatus: {
            get() {
                return this.option.active;
            },
            set(newval) {
                this.addStore.updateOption(this.addId, this.option.id, newval, 'status');
            }
        },
        optName: {
            get() {
                return this.option.name;
            },
            set(newval) {
                this.addStore.updateOption(this.addId, this.option.id, newval, 'name');       
            }
        },
        optPrice: {
            get() {
                return this.option.price;
            },
            set(newval) {
                this.addStore.updateOption(this.addId, this.option.id, newval, 'price');
            }
        },
        optMax: {
            get() {
                return this.option.max;
            },
            set(newval) {
                this.addStore.updateOption(this.addId, this.option.id, newval, 'name');
            }
        },
    },
    methods: {
        cofirmOptionDeletion() {
            this.addStore.showConfirmDialog({
                name: this.option.name,
                id: this.option.id,
                type: 'option'
            });
        }
    },
    setup() {
        //const uAMenuStore = useAdminMenuStore();
        const addStore = useAdminAdditionalsStore();
        //uAMenuStore.loadMenuInformation();
        return {
            //uAMenuStore,
            addStore,
            //showAssociationMenu: ref(false),
        }
    }
}
</script>