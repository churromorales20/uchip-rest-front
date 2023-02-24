<template>
    <q-fab v-for="(notification, noti_index) in notiStore.list" :key="'_notification_admin_' + noti_index"
        :style="'top:' + ((130 * noti_index) + 60) + 'px;'" square vertical-actions-align="right" color="green-11"
        text-color="green-10" icon="fa-regular fa-bell" direction="left" class="admin-orders-notification">
        <template v-slot:label>
            <div class="admin-orders-notification-new">
                <h5>Nueva orden</h5>
                <h6>{{ notification.customer }}</h6>
                <h6>{{ notification.items_qty }} Items x</h6>
                <h5>Total: <b>{{ $currencyFormatter(notification.order_total) }}</b></h5>
            </div>
        </template>
        <q-fab-action :loading="true" color="green-14" @click="onClick" icon="fa-solid fa-check" label="Aceptar" />
        <q-fab-action color="admin-light" @click="onClick" icon="fa-solid fa-file-invoice" label="Ver detalles" />
        <q-fab-action color="orange" @click="onClick" icon="fa-solid fa-ban" label="Rechazar" />
        <q-fab-action color="accent" @click="markAsReaded(noti_index)" icon="fa-regular fa-bell-slash"
            label="Ocultar notificacion" />
    </q-fab>
</template>
<script>
import { ref } from 'vue'
//import AdminProductAdditionals from './Additionals.vue';
import { useAdminNotificationsStore } from 'stores/admin_notifications'
import soundFile from '../../assets/audio/notification_alert.wav'
export default {
    name: 'AdminBubbleNotifications',
    components: {

    },
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
    inject: ['laravelEcho'],
    methods: {
        markAsReaded(noti_index) {
            this.notiStore.delete(noti_index);
        }
    },
    mounted() {
        this.laravelEcho.private('admin-notifications')
            .listen('NewAdminNotification', (e) => {
                this.notiStore.new({
                    ...e.payload,
                    type: e.type
                });
                this.$refs.audioPlayer.play();
                const reminder = () => {
                    setTimeout(() => {
                        if (this.notiStore.list.length > 0) {
                            this.$refs.audioPlayer.play();
                            reminder();
                        }
                    }, 4000);
                }
                //reminder();
            });
    },
    beforeUnmount() {
        this.laravelEcho.private('admin-notifications')
            .stopListening('NewAdminNotification')
    },
    setup() {
        const notiStore = useAdminNotificationsStore();
        const random = (min, max) => {
            return Math.floor(Math.random() * max) + min;
        }
        const generate = (timeout) => {
            setTimeout(() => {
                console.log('NANANANAAN', timeout);
                notiStore.new({
                    customer: 'Ricarod',
                    items_qty: 4,
                    order_total: 45.67
                });
                generate(random(10, 22));
            }, timeout * 1000);
        }
        //generate(random(5, 8));
        //uAMenuStore.loadMenuInformation();
        return {
            notiStore,
            soundFile
            //echo: ref(null)
        }
    }
}
</script>