<template>
    <div class="col-3">
        <div class="admin-orders-panel-box">
            <div class="admin-orders-panel-box-header">
                <div>
                    <h5>Pedido: {{ orderItem.locator }}</h5>
                    <h6><q-icon name="fa-solid fa-calendar-days"></q-icon> {{ orderItem.created_at }}</h6>
                    <q-chip square color="admin-light" text-color="white" icon="fa-solid fa-motorcycle">Delivery</q-chip>
                </div>
                <div>
                    <AdminOrderClock :timeCreatedAt="orderItem.time_created_at"/>
                </div>
            </div>
            <div class="admin-orders-panel-box-user">
                <h6><q-icon name="fa-solid fa-user"></q-icon> {{ orderItem.user_data.name }}</h6>
                <h6><q-icon name="fa-solid fa-location-dot"></q-icon> {{ orderItem.delivery_address.text }}
                </h6>
                <h6><q-icon name="fa-solid fa-phone"></q-icon> {{ orderItem.user_data.phone }}</h6>
                <q-chip 
                    square 
                    :color="paymentStatusUIData.color" 
                    text-color="white" 
                    :icon="paymentStatusUIData.icon">
                        {{ paymentStatusUIData.name }}
                </q-chip>
                <q-chip v-if="orderItem.status == 'accepted'" square color="amber-9" text-color="white" icon="fa-solid fa-hourglass-half">En espera</q-chip>
            </div>
            <div class="admin-orders-panel-box-buttons">
                <q-btn 
                    size="sm" 
                    padding="sm"
                    icon="fa-solid fa-list" 
                    label="Ver detalles" 
                    @click="ordersStore.setViewingOrder(orderItem)"
                    color="admin-light" />
                <q-btn-dropdown 
                    size="sm" 
                    padding="sm"
                     
                    class="middlebtn">
                    <template v-slot:label>
                        <div class="admin-orders-panel-box-buttons-label">
                            <q-icon name="fa-solid fa-business-time" />
                            <span>Status</span>
                        </div>
                    </template>
                </q-btn-dropdown>
                <q-btn-dropdown 
                    size="sm" 
                    padding="sm"
                     
                    color="admin-light">
                    <template v-slot:label>
                        <div class="admin-orders-panel-box-buttons-label">
                            <q-icon name="fa-solid fa-credit-card" />
                            <span>Pagos</span>
                        </div>
                    </template>
                    <q-item>
                        bnigo
                    </q-item>
                    <q-item>
                        bnigo
                    </q-item>
                </q-btn-dropdown>
            </div>
            <div class="row admin-orders-panel-box-footer">
                <div class="col-6">
                    <q-chip 
                        square 
                        :color="statusUIData.color" 
                        text-color="white" 
                        :icon="statusUIData.icon">
                        {{ statusUIData.name }}
                    </q-chip>
                </div>
                <div class="col-6" style="text-align:right;">
                    <h6>{{ orderItem.items_qty }} Items X</h6>
                    <h4>Total: 56.69 S/.</h4>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'
import { useAdminOrdersStore } from 'stores/admin_orders'
import AdminOrderClock from '../../../components/admin/OrderClock.vue';

export default {
    name: 'OrderBox',
    displayName: 'OrderBox',
    props: ['orderIndex'],
    components: {
        AdminOrderClock
    },
    computed: {
        orderItem(){
            return this.ordersStore.liveOrders[this.orderIndex];
        },
        statusUIData(){
            switch (this.ordersStore.liveOrders[this.orderIndex].status) {
                case 'pending':
                    return {
                        icon: 'fa-solid fa-hourglass-half',
                        name: 'Pendiente',
                        color: 'orange-14'
                    }
                    break;
                case 'accepted':
                    return {
                        icon: 'fa-solid fa-check',
                        name: 'Pedido aceptado',
                        color: 'green-14'
                    }
                    break;
                case 'ended':
                    return {
                        icon: 'fa-solid fa-check',
                        name: 'Pedido finalizado',
                        color: 'admin-light'
                    }
                    break;
                case 'rejected':
                    return {
                        icon: 'fa-solid fa-ban',
                        name: 'Pedido rechazado',
                        color: 'admin-warning'
                    }
                    break;
            }
            return this.ordersStore.liveOrders[this.orderIndex];
        },
        paymentStatusUIData(){
            switch (this.ordersStore.liveOrders[this.orderIndex].payment_status) {
                case 0:
                    return {
                        icon: 'fa-solid fa-ban',
                        name: 'No pagado',
                        color: 'admin-warning'
                    }
                    break;
                case 1:
                    return {
                        icon: 'fa-solid fa-check',
                        name: 'Pago aceptado',
                        color: 'green-14'
                    }
                    break;
                case 2:
                    return {
                        icon: 'fa-solid fa-check',
                        name: 'Pago rechazado',
                        color: 'red-14'
                    }
                    break;
            }
            return this.ordersStore.liveOrders[this.orderIndex];
        },
    },
    methods: {

    },
    setup() {
        const ordersStore = useAdminOrdersStore();
        return {
            ordersStore
        }
    }
}
</script>