<template>
    <div :class="isInDetail == undefined ? 'admin-orders-panel-box-buttons' : 'col-12 admin-orders-panel-box-buttons admin-orders-modal-box-buttons'">
        <q-btn 
            v-if="isInDetail == undefined"
            size="sm" 
            padding="sm"
            icon="fa-solid fa-list" 
            label="Ver detalles" 
            @click="ordersStore.viewDetailsById(orderId)"
            color="admin-light" />
        <template v-if="orderStatus == 'pending'">
            <q-btn 
                size="sm"
                @click="changeStatus('accepted')"
                color="green-14"
                :disable="loaders.loading"
                :loading="loaders.accepted"
                style="padding-left: 15px;padding-right: 15px;"
                padding="sm">
                <div class="admin-orders-panel-box-buttons-label">
                    <q-icon name="fa-solid fa-check" />
                    <span>Aceptar</span>
                </div>
            </q-btn>
            <q-btn 
                size="sm"
                @click="changeStatus('rejected')" 
                padding="sm"
                :disable="loaders.loading"
                :loading="loaders.rejected"
                style="padding-left: 15px;padding-right: 15px;"
                color="red-14">
                <div class="admin-orders-panel-box-buttons-label">
                    <q-icon name="fa-solid fa-ban" />
                    <span>Rechazar</span>
                </div>
            </q-btn>
        </template>
        <template v-else-if="orderStatus == 'rejected'">
            <q-btn 
                size="sm"
                @click="changeStatus('accepted')"
                color="green-14"
                :disable="loaders.loading"
                :loading="loaders.accepted"
                style="padding-left: 15px;padding-right: 15px;"
                padding="sm">
                <div class="admin-orders-panel-box-buttons-label">
                    <q-icon name="fa-solid fa-recycle" />
                    <span>Retomar pedido</span>
                </div>
            </q-btn>
        </template>
        <template v-else-if="orderStatus != 'ended'">
            <q-btn-dropdown 
                size="sm" 
                padding="sm"
                :disable="loaders.loading"
                :loading="loaders.store"
                class="middlebtn">
                <template v-slot:label>
                    <div class="admin-orders-panel-box-buttons-label">
                        <q-icon name="fa-solid fa-business-time" />
                        <span>Status</span>
                    </div>
                </template>
                <q-list>
                    <q-item :disable="orderStoreStatus == 'waiting'" class="admin-payment-status-option" clickable v-close-popup @click="changeStoreStatus('waiting')">
                        <q-icon name="fa-solid fa-hourglass-half"></q-icon>
                        <span>
                            En espera
                        </span>
                    </q-item>
                    <q-item :disable="orderStoreStatus == 'preparing'" class="admin-payment-status-option" clickable v-close-popup @click="changeStoreStatus('preparing')">
                        <q-icon name="fa-solid fa-kitchen-set"></q-icon>
                        <span>
                            En preparacion
                        </span>
                    </q-item>
                    <q-item :disable="orderStoreStatus == 'done'" class="admin-payment-status-option" clickable v-close-popup @click="changeStoreStatus('done')">
                        <q-icon name="fa-solid fa-check"></q-icon>
                        <span>
                            Listo
                        </span>
                    </q-item>
                    <q-item :disable="orderStoreStatus == 'delivering'" class="admin-payment-status-option" clickable v-close-popup @click="changeStoreStatus('delivering')">
                        <q-icon name="fa-solid fa-person-biking"></q-icon>
                        <span>
                            En camino
                        </span>
                    </q-item>
                    <q-item :disable="orderStoreStatus == 'delivered'" class="admin-payment-status-option" clickable v-close-popup @click="changeStoreStatus('delivered')">
                        <q-icon name="fa-solid fa-person-circle-check"></q-icon>
                        <span>
                            Entregado
                        </span>
                    </q-item>
                    <q-item class="admin-payment-status-option" clickable v-close-popup @click="changeStatus('ended')">
                        <q-icon name="fa-regular fa-calendar-check"></q-icon>
                        <span>
                            Finalizar pedido
                        </span>
                    </q-item>
                    <q-item class="admin-payment-status-option reject" clickable v-close-popup @click="changePaymentStatus(2)">
                        <q-icon name="fa-solid fa-ban"></q-icon>
                        <span>
                            Anular pedido.
                        </span>
                    </q-item>
                </q-list>
            </q-btn-dropdown>
            <q-btn-dropdown 
                size="sm" 
                padding="sm"
                :disable="loaders.loading"
                :loading="loaders.paying"
                class="admin-order-box-buttons-payment"
                color="admin-light">
                <template v-slot:label>
                    <div class="admin-orders-panel-box-buttons-label">
                        <q-icon name="fa-solid fa-credit-card" />
                        <span>Pagos</span>
                    </div>
                </template>
                <q-list>
                    <q-item :disable="orderPaymentStatus == 1" class="admin-payment-status-option accept" clickable v-close-popup @click="changePaymentStatus(1)">
                        <q-icon name="fa-solid fa-check"></q-icon>
                        <span>
                            Confirmar pago
                        </span>
                    </q-item>
                    <q-item :disable="orderPaymentStatus == 2" class="admin-payment-status-option reject" clickable v-close-popup @click="changePaymentStatus(2)">
                        <q-icon name="fa-solid fa-ban"></q-icon>
                        <span>
                            Rechazar pago
                        </span>
                    </q-item>
                </q-list>
            </q-btn-dropdown>
        </template>
    </div>
</template>

<script>
import { ref } from 'vue'
import { useAdminOrdersStore } from 'stores/admin_orders'

export default {
    name: 'AdminOrderBoxButtons',
    displayName: 'AdminOrderBoxButtons',
    props: [
        'orderId', 
        'orderStatus', 
        'orderPaymentStatus', 
        'orderStoreStatus',
        'isInDetail'
    ],
    components: {
        
    },
    computed: {
        
    },
    methods: {
        async changeStatus(new_status){
            this.loaders.loading = true; 
            this.loaders[new_status] = true;
            this.loaders['store'] = true;
            await this.ordersStore.changeStatusById(this.orderId, {
                type: 'order_status',
                status: new_status
            });
            this.loaders[new_status] = false;
            this.loaders['store'] = false;
            this.loaders.loading = false;
        },
        async changePaymentStatus(new_status){
            this.loaders.loading = true; 
            this.loaders['paying'] = true;
            await this.ordersStore.changeStatusById(this.orderId, {
                type: 'payment_status',
                status: new_status
            });
            this.loaders['paying'] = false;
            this.loaders.loading = false;
        },
        async changeStoreStatus(new_status){
            this.loaders.loading = true; 
            this.loaders['store'] = true;
            await this.ordersStore.changeStatusById(this.orderId, {
                type: 'store_status',
                status: new_status
            });
            this.loaders['store'] = false;
            this.loaders.loading = false;
        }
    },
    setup() {
        const ordersStore = useAdminOrdersStore();
        const loaders = {
            loading: false,
            accepted: false,
            rejected: false,
            paying: false,
            store: false
        };
        return {
            ordersStore,
            loaders: ref(loaders),
        }
    }
}
</script>