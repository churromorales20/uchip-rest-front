<template>
    <q-expansion-item :expand-icon-toggle="true" class="admin-menu-category-item">
        <template v-slot:header>
            <div class="admin-menu-category-item-header">
                <q-icon name="fa-solid fa-grip" color="admin-default"></q-icon>
                <q-input filled v-model="name" label="Nombre de la categoria:" maxlength="40" :dense="true" stack-label />
                <q-btn outline color="positive" size="sm" icon="fa-solid fa-check" label="Disponible" />
                <q-btn outline color="admin-default" size="sm" icon="fa-solid fa-trash" class="q-ml-sm q-mr-sm" />
            </div>
        </template>
        <div class="admin-menu-category-item-content">
            <draggable v-model="productsList" group="category_menu_" @start="drag = true" @end="drag = false" item-key="id">
                <template #item="{ element }">
                    <AdminProduct :categoryId="categoryElement.id" :productItem="element">
                    </AdminProduct>
                </template>
            </draggable>
            ARGERA
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
                //this.uAMenuStore.setCategoriesMap(newMap);
                //this.$store.commit('updateList', value)
            }
        },
        name: {
            get() {
                return this.categoryElement.name;
            },
            set(newMap) {
                //this.uAMenuStore.setCategoriesMap(newMap);
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