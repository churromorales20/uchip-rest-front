<template>
     <q-knob 
        readonly 
        v-model="timeElapsed" 
        show-value 
        size="65px" 
        :thickness="0.3" 
        :max="maxSeconds"
        :color="clockColor" 
        :track-color="clockTrackColor" 
        :class="'text-' + clockColor">
        <span class="admin-orders-panel-box-clock">
            {{ clockTimer }}
        </span>
    </q-knob>
</template>

<script>
import { ref } from 'vue'
import { useAdminOrdersStore } from 'stores/admin_orders'
import moment from 'moment'
export default {
    name: 'AdminOrderClock',
    displayName: 'AdminOrderClock',
    props: ['timeCreatedAt'],
    components: {

    },
    computed: {
        clockColor() {
            //console.log('half_eigth', half_eigth);
            if (this.timeElapsed > 0 & this.timeElapsed <= this.clockColorsLimits[0]) {
                return 'green-14';
            } else if (this.timeElapsed > this.clockColorsLimits[0] & this.timeElapsed <= this.clockColorsLimits[1]) {
                return 'lime-14';
            } else if (this.timeElapsed > this.clockColorsLimits[1] & this.timeElapsed <= this.clockColorsLimits[2]) {
                return 'yellow-14';
            } else if (this.timeElapsed > this.clockColorsLimits[2] && this.timeElapsed <= this.clockColorsLimits[3]) {
                return 'amber-14';
            } else if (this.timeElapsed > this.clockColorsLimits[3] & this.timeElapsed <= this.clockColorsLimits[4]) {
                return 'orange-14';
            } else if (this.timeElapsed > this.clockColorsLimits[4] & this.timeElapsed <= this.clockColorsLimits[5]) {
                return 'deep-orange-14';
            } else {
                return 'red-14';
            }
        },
        clockTrackColor() {
            //console.log('half_eigth', half_eigth);
            if (this.timeElapsed > 0 & this.timeElapsed <= this.clockColorsLimits[0]) {
                return 'green-3';
            } else if (this.timeElapsed > this.clockColorsLimits[0] & this.timeElapsed <= this.clockColorsLimits[1]) {
                return 'lime-3';
            } else if (this.timeElapsed > this.clockColorsLimits[1] & this.timeElapsed <= this.clockColorsLimits[2]) {
                return 'yellow-3';
            } else if (this.timeElapsed > this.clockColorsLimits[2] && this.timeElapsed <= this.clockColorsLimits[3]) {
                return 'amber-3';
            } else if (this.timeElapsed > this.clockColorsLimits[3] & this.timeElapsed <= this.clockColorsLimits[4]) {
                return 'orange-3';
            } else if (this.timeElapsed > this.clockColorsLimits[4] & this.timeElapsed <= this.clockColorsLimits[5]) {
                return 'deep-orange-3';
            } else {
                return 'red-3';
            }
        },
        clockTimer() {
            const completeNumber = (numb) => {
                numb = parseInt(numb);
                return numb <= 9 ? '0' + numb : numb;
            }
            return completeNumber(Math.floor(this.timeElapsed / 60)) + ':' + completeNumber(this.timeElapsed % 60);
        },
    },
    methods: {

    },
    mounted() {
        //console.log(this.ordersStore.liveOrders[this.orderIndex].time_created_at);
        this.timeElapsed = moment.duration(Date.now() - moment.unix(this.timeCreatedAt)).asSeconds();
        //console.log('this.timeElapsed', this.timeElapsed);
        this.interval = setInterval(() => {
            this.timeElapsed++;
            if(this.timeElapsed >= this.maxSeconds){
                clearInterval(this.interval);
            }
        }, 1000);
    },
    beforeUnmount() {
        clearInterval(this.interval);
    },
    setup() {
        const ordersStore = useAdminOrdersStore();
        const max_seconds = ordersStore.liveConfig.max_minutes * 60;
        const oQuarterTime = Math.floor(max_seconds / 4);
        const oEighthTime = Math.floor(max_seconds / 9);
        const e_q = oEighthTime + oQuarterTime;
        const clockColorsLimits = [
            e_q,
            e_q + oEighthTime,
            e_q + (oEighthTime * 2),
            e_q + (oEighthTime * 3),
            e_q + (oEighthTime * 4),
            e_q + (oEighthTime * 5),
        ];
        
        return {
            timeElapsed: ref(0),
            interval: ref(null),
            ordersStore,
            maxSeconds: ref(max_seconds),
            clockColorsLimits
        }
    }
}
</script>