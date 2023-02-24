<template>
     <div>
        <audio ref="audioPlayer" :src="soundFile"></audio>
    </div>
    <TransitionGroup 
        leave-active-class="animated bounceOut"
        enter-active-class="animated bounceIn">
        <AdminBubbleNotificationItem
            v-for="(notification, noti_index) in notiStore.list"
            :notiIndex="noti_index"
            :notification="notification"
            :key="'_notification_admin_' + noti_index" />
    </TransitionGroup>
</template>
<script>
import { ref } from 'vue'
import AdminBubbleNotificationItem from './BubbleNotificationItem.vue';
import { useAdminNotificationsStore } from 'stores/admin_notifications'
import soundFile from '../../assets/audio/notification_alert.wav'
export default {
    name: 'AdminBubbleNotifications',
    components: {
        AdminBubbleNotificationItem
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
        markAsReaded(noti_index){
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
            reminder();
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