<template>
    <q-fab
        ref="fab"
        :style="'top:' + ((130 * notiIndex) + 60) + 'px;'"
        square
        vertical-actions-align="right"
        color="green-11"
        text-color="green-10"
        icon="fa-regular fa-bell"
        direction="left"
        @before-hide="preventHide()"
        class="admin-orders-notification"> 
        <template v-slot:label>
            <div class="admin-orders-notification-new">
                <h5>Nueva orden</h5>
                <h6>{{ notification.customer }}</h6>
                <h6>{{ notification.items_qty }} Items x</h6>
                <h5>Total: <b>{{ $currencyFormatter(notification.order_total) }}</b></h5>
            </div>
        </template>
        <q-fab-action 
            :disable="isLoading" 
            :loading="isLoading" 
            color="green-14" 
            @click="acceptOrder" 
            icon="fa-solid fa-check"
            style="opacity: unset !important;" 
            label="Aceptar" />
        <q-fab-action 
            :disable="isLoading" 
            color="admin-light" 
            style="opacity: unset !important;"
            @click="viewDetails" 
            icon="fa-solid fa-file-invoice" 
            label="Ver detalles" />
        <!--<q-fab-action 
            color="orange"
            style="opacity: unset !important;" 
            @click="onClick" 
            icon="fa-solid fa-ban"
            label="Rechazar" />-->
        <q-fab-action 
            color="accent"
            style="opacity: unset !important;" 
            @click="markAsReaded" 
            icon="fa-regular fa-bell-slash" 
            label="Ocultar notificacion" />
    </q-fab>
</template>
<script>
import { ref } from 'vue'
//import AdminProductAdditionals from './Additionals.vue';
import { useAdminNotificationsStore } from 'stores/admin_notifications'
import { useAdminOrdersStore } from 'stores/admin_orders'
export default {
    name: 'AdminBubbleNotificationItem',
    components: {
        
    },
    props: ['notiIndex','notification'],
    computed: {
        productName: {
            get() {
                return this.productItem.name;
            },
            set(newName) {
                this.uAMenuStore.updateProductInfo(this.categoryId, this.productItem.id, newName, 'name');
            }
        }
    },
    methods: {
        markAsReaded(){
            this.notiStore.delete(this.notiIndex);
        },
        viewDetails(){
            if(this.$route.name === 'admimOrdersLive'){
                this.orderStore.viewDetailsById(this.notification.id);
            }else{
                this.orderStore.setOrderToShow(this.notification.id);
                this.$router.push({ name: 'admimOrdersLive'});
            }
            this.notiStore.delete(this.notiIndex);
        },
        preventHide(){
            if(this.isLoading){
                this.$refs.fab.show();
            }
        },
        async acceptOrder(){
            this.$refs.fab.show()
            this.isLoading = true;
            this.isAccepting = true;
            await this.orderStore.changeStatusById(this.notification.id, {
                type: 'order_status',
                status: 'accepted'
            });
            this.isLoading = false;
            this.isAccepting = false;
        }
    }, 
    mounted() {
        
    },
    beforeUnmount() {
        
    },
    setup() {
        const notiStore = useAdminNotificationsStore();
        const orderStore = useAdminOrdersStore();
        return {
            notiStore,
            orderStore,
            isLoading: ref(false),
            isAccepting: ref(false),
            isRejecting: ref(false),
        }
    }
}
</script>