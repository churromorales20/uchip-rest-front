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
            <h5 class="admin-module-title">
                Ordeness (filtros: X TODOS, EN EPSERA, EN PREPARACION, FINALIZADOS, MAS FILTROS)
            </h5>
            <div class="row admin-orders-panel">
               <OrderBox 
                    v-for="(order, order_index) in ordersStore.liveOrders" 
                    :orderIndex="order_index"
                    :key="'_live_order_' + order.id"/>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'
import { useAdminMenuStore } from 'stores/admin_menu'
import { useAdminOrdersStore } from 'stores/admin_orders'
import AdminBreadCrumbs from '../../../components/admin/BreadCrumbs.vue';
import OrderBox from './OrderBox.vue';
export default {
    name: 'AdminOrdersLive',
    displayName: 'AdminOrdersLive',
    components:{
        OrderBox,
        AdminBreadCrumbs
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
        },
    },
    methods:{
        
    },
    setup() {
        const uAMenuStore = useAdminMenuStore();
        const ordersStore = useAdminOrdersStore();
        ordersStore.loadLiveInformation();
        return {
            uAMenuStore,
            deletingProduct: ref(false),
            timer: ref(70),
            ordersStore
        }
    }
}
</script>