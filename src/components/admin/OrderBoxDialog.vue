<template>
    <div class="admin-orders-panel-box admin-orders-modal-box">
                <div class="admin-orders-panel-box-header">
                    <div>
                        <h5>Pedido: {{ orderItem.locator }}</h5>
                        <h6><q-icon name="fa-solid fa-calendar-days"></q-icon> {{ orderItem.created_at }}</h6>
                        <q-chip square :color="statusUIData.color" text-color="white" :icon="statusUIData.icon">
                                {{ statusUIData.name }}
                        </q-chip>
                        <q-chip square color="admin-light" text-color="white" icon="fa-solid fa-motorcycle">Delivery</q-chip>
                    </div>
                    <div>
                        <AdminOrderClock :timeCreatedAt="orderItem.time_created_at" />
                    </div>
                </div>
                <div class="admin-orders-panel-box-user">
                    <h6><q-icon name="fa-solid fa-user"></q-icon> {{ orderItem.user_data.name }}</h6>
                    <h6><q-icon name="fa-solid fa-location-dot"></q-icon> {{ orderItem.delivery_address.text }}
                    </h6>
                    <h6><q-icon name="fa-solid fa-phone"></q-icon> {{ orderItem.user_data.phone }}</h6>
                    <div class="admin-orders-modal-statuses">
                        <div class="admin-orders-modal-statuses-title">
                            <q-icon name="fa-regular fa-credit-card"></q-icon>
                            <span>Metodo de pago: <b>{{ orderItem.payment_method }}</b></span>
                            <q-icon class="admin-orders-modal-statuses-editbtn" name="fa-regular fa-pen-to-square"></q-icon>
                        </div>
                        <q-chip 
                            square 
                            :color="paymentStatusUIData.color" 
                            text-color="white" 
                            class="q-ml-lg"
                            :icon="paymentStatusUIData.icon">
                            {{ paymentStatusUIData.name }}
                        </q-chip>
                    </div>
                    <div v-if="orderItem.status == 'accepted'" class="admin-orders-modal-statuses">
                        <div class="admin-orders-modal-statuses-title">
                            <q-icon name="fa-regular fa-credit-card"></q-icon>
                            <span>Status de la orden</span>
                        </div>
                        <q-chip square color="amber-9" text-color="white"
                        icon="fa-solid fa-hourglass-half">En espera</q-chip>
                    </div>
                </div>
                <div class="admin-orders-modal-items">
                    <h6>Items en esta orden</h6>
                     <ul>
                         <li v-for="product in orderItem.products" :key="'_order_item' + product.id">
                            <div>
                                <div class="admin-orders-modal-items-name">
                                    X{{ product.qty }} {{ product.name }}
                                    <p class="comments" v-if="product.comments !== ''">"{{ product.comments }}"</p>
                                </div>
                                <div class="admin-orders-modal-items-total">
                                    S\. {{ (product.qty * product.unit_price) + product.total_additionals }}
                                </div>
                            </div>
                         </li>
                     </ul>
                     <div class="admin-orders-modal-items-totalizer">
                         <span>TOTAL: <b>S/. 45.98</b></span>
                     </div>
                </div>
                <div class="row admin-orders-panel-box-footer">
                    <div class="col-12 admin-orders-panel-box-buttons admin-orders-modal-box-buttons">
                        <q-btn-dropdown size="sm" padding="sm" class="middlebtn">
                            <template v-slot:label>
                                <div class="admin-orders-panel-box-buttons-label">
                                    <q-icon name="fa-solid fa-business-time" />
                                    <span>Status</span>
                                </div>
                            </template>
                        </q-btn-dropdown>
                        <q-btn-dropdown size="sm" padding="sm" color="admin-light">
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
                </div>
            </div>
</template>

<script>
import { ref } from 'vue'
import { useAdminOrdersStore } from 'stores/admin_orders'
import AdminOrderClock from './OrderClock.vue';

export default {
    name: 'OrderBoxDialog',
    displayName: 'OrderBoxDialog',
    props: ['orderIndex'],
    components: {
        AdminOrderClock
    },
    computed: {
        orderItem() {
            return this.ordersStore.featured;
        },
        statusUIData() {
            switch (this.ordersStore.featured.status) {
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
            return this.ordersStore.featured;
        },
        paymentStatusUIData() {
            switch (this.ordersStore.featured.payment_status) {
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
            return this.ordersStore.featured;
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