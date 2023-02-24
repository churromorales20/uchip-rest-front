<template>
    <div v-if="ordersStore.isLiveLoading" class="admin-main-wrapper">
        <q-circular-progress indeterminate size="200px" :thickness="0.1" rounded color="secondary" track-color="grey-3"
            class="q-ma-md" />
    </div>
    <div v-else>
        <AdminBreadCrumbs />
        <div class="admin-orders-preview">
            <div class="row">
                <div class="col-3">
                    PERSONAS EN EL SITIO 
                    FECHA Y HORA
                </div>
                <div class="col-3">
                    <div class="admin-orders-preview-icon">
                        <q-icon name="fa-solid fa-home"></q-icon>
                    </div>
                    <div>
                        <h5>Total ventas del dia</h5>
                        <h4>203.56 S/.</h4>
                    </div>
                </div>
                <div class="col-3">
                    <div class="admin-orders-preview-icon">
                        <q-icon name="fa-solid fa-home"></q-icon>
                    </div>
                    <div>
                        <h5>Cantidad de pedidos</h5>
                        <h4>10</h4>
                    </div>
                </div>
                <div class="col-3">
                    <div class="admin-orders-preview-icon">
                        <q-icon name="fa-solid fa-home"></q-icon>
                    </div>
                    <div>
                        <h5>Pedidos entregados</h5>
                        <h4>8</h4>
                    </div>
                </div>
            </div>
        </div>
        <div class="admin-module-container">  
            <div class="admin-orders-live-filters">
                 <h5 class="admin-module-title">
                    Ordenes actuales
                </h5>
                <div style="margin-left: 2rem;">
                    <q-toggle
                        class="admin-orders-live-filters-toggle"
                        v-model="allFilters"
                        checked-icon="check"
                        color="admin-ligth"
                        label="Todos"
                        unchecked-icon="clear"
                    />
                    <q-toggle
                        class="admin-orders-live-filters-toggle"
                        v-model="liveFilters"
                        val="pending"
                        checked-icon="fa-regular fa-hourglass-half"
                        color="light-blue-13"
                        label="Pendientes"
                        unchecked-icon="fa-regular fa-hourglass-half"
                    />
                    <q-toggle
                        class="admin-orders-live-filters-toggle"
                        v-model="liveFilters"
                        val="accepted"
                        checked-icon="fa-solid fa-check-double"
                        color="light-blue-13"
                        label="Aceptados"
                        unchecked-icon="fa-solid fa-check-double"
                    />
                    <q-toggle
                        v-model="liveFilters"
                        val="rejected"
                        checked-icon="fa-solid fa-ban"
                        color="light-blue-13"
                        label="Rechazados"
                        unchecked-icon="fa-solid fa-ban"
                    />
                    <q-toggle
                        v-model="liveFilters"
                        val="ended"
                        checked-icon="fa-regular fa-calendar-check"
                        color="light-blue-13"
                        label="Finalizados"
                        unchecked-icon="fa-regular fa-calendar-check"
                    />
                </div>
            </div>
            <div class="row admin-orders-panel">
                <TransitionGroup 
                    leave-active-class="animated zoomOut"
                    enter-active-class="animated zoomIn">
                    <OrderBox 
                            v-for="(order, order_index) in ordersStore.liveOrders" 
                            :orderIndex="order_index"
                            :key="'_live_order_' + order.id"/>
                </TransitionGroup>
            </div>
        </div>
    </div>
</template>

<script>
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import { useAdminMenuStore } from 'stores/admin_menu'
import { useAdminOrdersStore } from 'stores/admin_orders'
import AdminBreadCrumbs from '../../../components/admin/BreadCrumbs.vue';
import OrderBox from './OrderBox.vue';
const defaultFilters = [
    'pending',
    'accepted',
    'ended',
    'rejected',
];
export default {
    name: 'AdminOrdersLive',
    displayName: 'AdminOrdersLive',
    components:{
        OrderBox,
        AdminBreadCrumbs
    },
    computed: {
        allFilters: {
            get() {
                return this.ordersStore.liveFilters.length === defaultFilters.length;
            },
            set(newMap) {
                if(newMap === true){
                    this.ordersStore.setLiveFilters(defaultFilters);
                }
            }
        },
        liveFilters: {
            get() {
                return this.ordersStore.liveFilters;
            },
            set(newMap) {
                this.ordersStore.setLiveFilters(newMap);
            }
        },
    },
    inject: ['laravelEcho'],
    methods:{
        
    },
    mounted() {
        this.ordersStore.showPendingOrder();
        const eventCallBack = (e) => {
            if(e.change !== undefined){
                this.ordersStore.updateLiveOrder(e);
            }else{
                this.ordersStore.addLiveOrder(e.order);
            }
            
        }
        this.laravelEcho.private('admin-orders-live')
            .listen('OrderUpdated', eventCallBack)
            .listen('OrderLive', eventCallBack);
    },
    setup() {
        const uAMenuStore = useAdminMenuStore();
        const ordersStore = useAdminOrdersStore();
        ordersStore.loadLiveInformation();
        const route = useRoute()
        return {
            uAMenuStore,
            route,
            deletingProduct: ref(false),
            filters: ref([
                'pending',
                'accepted',
                'ended',
            ]),
            ordersStore
        }
    }
}
</script>