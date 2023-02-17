<template>
    <div class="admin-breadcrumbs">
        <q-breadcrumbs class="text-grey" active-color="purple">
            <template v-slot:separator>
                <q-icon size="1.2em" name="arrow_forward" color="purple" />
            </template>
        
            <q-breadcrumbs-el label="Home" icon="home" />
            <q-breadcrumbs-el label="Components" icon="widgets" />
            <q-breadcrumbs-el label="Breadcrumbs" icon="navigation" />
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