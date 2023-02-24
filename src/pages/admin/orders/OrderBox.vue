<template>
    <div class="col-3">
        <div class="admin-orders-panel-box">
            <div class="admin-orders-panel-box-header">
                <div>
                    <h5>Pedido: {{ orderItem.locator }}</h5>
                    <h6><q-icon name="fa-solid fa-calendar-days"></q-icon> {{ orderItem.formatted_created_at }}</h6>
                    <q-chip square color="admin-light" text-color="white" icon="fa-solid fa-motorcycle">Delivery</q-chip>
                </div>
                <div>
                    <q-icon 
                        :name="orderItem.status == 'rejected' ? 'fa-solid fa-ban' : 'fa-solid fa-lock'" 
                        class="admin-order-box-icon-rejected"
                        v-if="orderItem.status == 'rejected' || orderItem.status == 'ended'">
                    </q-icon>
                    <AdminOrderClock v-else :timeCreatedAt="orderItem.time_created_at"/>
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
                <q-chip 
                    v-if="orderItem.status == 'accepted' || orderItem.status == 'ended'" 
                    square 
                    :color="storeStatusUIData.color" 
                    text-color="white" 
                    :icon="storeStatusUIData.icon">
                    {{ storeStatusUIData.name }}
                </q-chip>
            </div>
            <AdminOrderBoxButtons 
                :orderStatus="orderItem.status"
                :orderPaymentStatus="orderItem.payment_status"
                :orderStoreStatus="orderItem.store_status"
                :orderId="orderItem.id"/>
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
                    <h4>Total: <b>{{ $currencyFormatter(orderItem.total)}}</b></h4>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'
import { useAdminOrdersStore } from 'stores/admin_orders'
import AdminOrderClock from '../../../components/admin/OrderClock.vue';
import AdminOrderBoxButtons from '../../../components/admin/OrderBoxButtons.vue';

export default {
    name: 'OrderBox',
    displayName: 'OrderBox',
    props: ['orderIndex'],
    components: {
        AdminOrderClock,
        AdminOrderBoxButtons
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
                        name: 'Orden aceptada',
                        color: 'green-14'
                    }
                    break;
                case 'ended':
                    return {
                        icon: 'fa-solid fa-check',
                        name: 'Orden finalizada',
                        color: 'admin-light'
                    }
                    break;
                case 'rejected':
                    return {
                        icon: 'fa-solid fa-ban',
                        name: 'Orden rechazada',
                        color: 'admin-warning'
                    }
                    break;
            }
            return this.ordersStore.liveOrders[this.orderIndex];
        },
        storeStatusUIData(){
            switch (this.ordersStore.liveOrders[this.orderIndex].store_status) {
                case 'waiting':
                    return {
                        icon: 'fa-solid fa-hourglass-half',
                        name: 'Pendiente',
                        color: 'orange-14'
                    }
                    break;
                case 'preparing':
                    return {
                        icon: 'fa-solid fa-kitchen-set',
                        name: 'En preparacion',
                        color: 'green-14'
                    }
                    break;
                case 'done':
                    return {
                        icon: 'fa-solid fa-check',
                        name: 'Listo para entrega',
                        color: 'admin-light'
                    }
                    break;
                case 'delivering':
                    return {
                        icon: 'fa-solid fa-person-biking',
                        name: 'Orden en camino',
                        color: 'admin-light'
                    }
                    break;
                case 'delivered':
                    return {
                        icon: 'fa-solid fa-person-circle-check',
                        name: 'Orden entregada.',
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
                        icon: 'fa-solid fa-question',
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
                        icon: 'fa-solid fa-ban',
                        name: 'Pago rechazado',
                        color: 'red-14'
                    }
                    break;
            }
            return this.ordersStore.liveOrders[this.orderIndex];
        },
    },
    methods: {
        async changeStatus(){
            //this.ordersStore.changeStatusById();
        }
    },
    setup() {
        const ordersStore = useAdminOrdersStore();
        return {
            ordersStore
        }
    }
}
</script>