<template>
    <div class="admin-breadcrumbs" v-show="userStore.navigationBreadCrumbs.length > 0">
        <q-breadcrumbs class="text-grey">
            <template v-slot:separator>
                <q-icon size="1.2em" name="arrow_forward" />
            </template>

            <q-breadcrumbs-el 
                v-for="item in userStore.navigationBreadCrumbs" :key="'_bread_crumb_item_' + item.id" 
                :label="item.title" 
                :icon="item.icon" />
        </q-breadcrumbs>
    </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useAdminUserStore } from 'stores/admin_user';
export default defineComponent({
    name: 'AdminBreadCrumbs',
    /*components: {
        ProductAdditionals
    },*/
    methods: {
        
    },
    setup() {
        const userStore = useAdminUserStore();
        return {
            userStore
        }
    }
})
</script>