<template>
    <q-dialog 
        v-model="showDialog"
        ref="_order_modal_dialog_" 
        :persistent="false">
        <q-card class="admin-orders-modal">
            <q-card-section>
                <OrderBoxDialog />
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script>
import { ref } from 'vue'
import { useAdminOrdersStore } from 'stores/admin_orders'
import OrderBoxDialog from './OrderBoxDialog.vue';
export default {
    name: 'AdminOrderDialog',
    displayName: 'AdminOrderDialog',
    components: {
        OrderBoxDialog
    },
    computed: {
        showDialog: {
            get() {
                return this.ordersStore.isOrderFeatured;
            },
            set(newMap) {
                this.ordersStore.setViewingOrder(null);
            }
        },
    },
    methods: {

    },
    setup() {
        
        const ordersStore = useAdminOrdersStore();
        return {
            ordersStore,
        }
    }
}
</script>