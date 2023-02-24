import { defineStore } from 'pinia';
import { uchipRequest } from '../utils/uchipRequest';
//const loaded_filters = JSON.parse(localStorage.getItem("admin_filters_val"));
export const useAdminNotificationsStore = defineStore('admin_notifications', {
    state: () => ({
        notifications: [],
    }),
    getters: {
        list: (state) => {
            return state.notifications;
        },
    },
    actions: {
        new(notification) {
            this.notifications.push(notification);
        },
        delete(index) {
            this.notifications.splice(index, 1);
        },
        async loadLiveInformation() {
            if (this.live_loaded === false) {
                this.loading_live = true;
                try {
                    const data = await uchipRequest.get('admin/orders/live',);

                    if (data.status == 'success') {
                        this.live_orders = data.orders;
                        this.live_loaded = true;
                    }
                    //this.loading_live = true;
                }
                catch (error) {
                    console.log(error)
                }
                this.loading_live = false;
            }
        },
    },
});
