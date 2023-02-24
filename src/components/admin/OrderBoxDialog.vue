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
                <q-icon 
                    :name="orderItem.status == 'rejected' ? 'fa-solid fa-ban' : 'fa-solid fa-lock'" 
                    class="admin-order-box-icon-rejected"
                    v-if="orderItem.status == 'rejected' || orderItem.status == 'ended'">
                </q-icon>
                <AdminOrderClock v-else :timeCreatedAt="orderItem.time_created_at" />
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
            <div 
                v-if="orderItem.status == 'accepted' || orderItem.status == 'ended'" 
                class="admin-orders-modal-statuses">
                <div class="admin-orders-modal-statuses-title">
                    <q-icon name="fa-solid fa-shop"></q-icon>
                    <span>Status de la orden en <b>tienda</b>:</span>
                </div>
                <q-chip 
                    square 
                    :color="storeStatusUIData.color" 
                    text-color="white"
                    :icon="storeStatusUIData.icon">
                    {{ storeStatusUIData.name }}
                </q-chip>
            </div>
        </div>
        <div class="admin-orders-modal-items">
            <div>
                <h6>Items en esta orden</h6>
                <a href="#" @click="fullItemDetails = !fullItemDetails">Ver todos los detalles</a>
            </div>
            <ul>
                <li v-for="product in orderItem.products" :key="'_order_item' + product.id">
                    <div>
                        <div class="admin-orders-modal-items-name">
                            X{{ product.qty }} {{ product.name }}
                            <q-slide-transition v-if="product.additionals.length > 0">
                                <div v-show="fullItemDetails">
                                    <ul>
                                        <li v-for="(add, addIndex) in product.additionals" :key="'_order_item' + product.id + '_add_' + addIndex">
                                            {{ add.q }} {{ add.m }} 
                                            <span v-if="parseFloat(add.p) > 0">
                                                (+ {{ $currencyFormatter(parseFloat(add.p)) }})
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </q-slide-transition>
                            <p class="comments" v-if="product.comments !== ''">"{{ product.comments }}"</p>
                        </div>
                        <div class="admin-orders-modal-items-total">
                            {{ $currencyFormatter((product.qty * product.unit_price) + product.total_additionals) }}
                        </div>
                    </div>
                </li>
            </ul>
            <div class="admin-orders-modal-items-totalizer">
                <q-slide-transition>
                    <div class="fulltotalizer" v-show="fullTotalizer">
                        <span>Total productos: <b>{{ orderTotalItems }}</b></span>
                        <span>Total descuentos: <b>{{ $currencyFormatter(orderItem.total_discount) }}</b></span>
                        <span v-if="orderItem.total_delivery > 0">Total delivery: <b>{{ $currencyFormatter(orderItem.total_delivery) }}</b></span>
                        <span v-if="orderItem.total_tip > 0">Total propina: <b>{{ $currencyFormatter(orderItem.total_tip) }}</b></span>
                    </div>
                </q-slide-transition>
                <span>TOTAL: <b>{{ $currencyFormatter(orderItem.total) }}</b></span>
                <a href="#" @click="fullTotalizer = !fullTotalizer">{{ fullTotalizer === true ? 'Menos detalles' : 'Ver detalles' }}</a>
            </div>
        </div>
        <div class="row admin-orders-panel-box-footer">
            <AdminOrderBoxButtons 
                :isInDetail="true"
                :orderPaymentStatus="orderItem.payment_status"
                :orderStoreStatus="orderItem.store_status"
                :orderStatus="orderItem.status"
                :orderId="orderItem.id"/>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'
import { useAdminOrdersStore } from 'stores/admin_orders'
import AdminOrderClock from './OrderClock.vue';
import AdminOrderBoxButtons from './OrderBoxButtons.vue';

export default {
    name: 'OrderBoxDialog',
    displayName: 'OrderBoxDialog',
    props: ['orderIndex'],
    components: {
        AdminOrderClock,
        AdminOrderBoxButtons
    },
    computed: {
        orderItem() {
            return this.ordersStore.featured;
        },
        orderTotalItems() {
            return this.$currencyFormatter(this.ordersStore.featured.total_items + this.ordersStore.featured.total_discount + this.ordersStore.featured.total_additionals);
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
        storeStatusUIData() {
            switch (this.ordersStore.featured.store_status) {
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
            return {
                icon: 'fa-solid fa-person-circle-check',
                name: 'Orden entregada.',
                color: 'admin-warning'
            };
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
            ordersStore,
            fullItemDetails: ref(false),
            fullTotalizer: ref(false),
        }
    }
}
</script>