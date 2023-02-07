<template>
    <div v-if="uAMenuStore.loading" class="admin-main-wrapper">
        <q-circular-progress indeterminate size="200px" :thickness="0.1" rounded color="secondary" track-color="grey-3"
            class="q-ma-md" />
    </div>
    <div v-else>
        <draggable 
            v-model="categoriesList" 
            group="categories_menu" 
            @start="drag=true" 
            @end="drag=false" 
            item-key="id">
            <template #item="{element}">
                <AdminMenuCategory :categoryElement="element"></AdminMenuCategory>
            </template>
        </draggable>
        <div>
            <q-btn outline color="positive" size="md" icon="fa-solid fa-plus" label="Nueva categoria" />
        </div>
    </div>
    
</template>

<script>
import draggable from 'vuedraggable'
import { ref } from 'vue'
import { useAdminMenuStore } from 'stores/admin_menu'
import AdminMenuCategory from './AdminMenuCategory.vue';
export default {
    name: 'AdminMenu',
    components:{
        draggable,
        AdminMenuCategory
    },
    computed: {
        categoriesList: {
            get() {
                return this.uAMenuStore.menuCategories;
            },
            set(newMap) {
                this.uAMenuStore.setCategoriesMap(newMap);
                //this.$store.commit('updateList', value)
            }
        }
    },
    setup() {
        const uAMenuStore = useAdminMenuStore();
        uAMenuStore.loadMenuInformation();
        return {
            uAMenuStore
        }
    }
}
</script>