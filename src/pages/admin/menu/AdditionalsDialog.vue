<template>
    <q-dialog 
        full-height
        ref="_product_additionals_dialog_" 
        v-model="showDialog" :persistent="false">
        <q-card class="admin-modal-additionals">
            <q-card-section>
                <h3>Adicionales disponibles.</h3>
                <div v-if="addStore.isDataLoading" class="admin-modal-additionals-loader">
                    <q-circular-progress 
                        indeterminate 
                        size="100px" 
                        :thickness="0.1" 
                        rounded 
                        color="secondary" 
                        track-color="grey-3" />
                </div>
                <div v-else>
                    LOS TOPING
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script>
import { ref } from 'vue'
import { useAdminMenuStore } from 'stores/admin_menu'
import { useAdminAdditionalsStore } from 'stores/admin_additionals';
export default {
    name: 'AdminAdditionalsDialog',
    props: ['productItem'],
    components: {
        //draggable
    },
    computed: {
        showDialog: {
            get() {
                return this.addStore.isShowingDialog;
            },
            set(newName) {
                this.addStore.showProductDialog(null);
            }
        },
    },
    methods: {
        
    },
    setup() {
        const uAMenuStore = useAdminMenuStore();
        const addStore = useAdminAdditionalsStore();
        //uAMenuStore.loadMenuInformation();
        return {
            uAMenuStore,
            addStore
            //changingStatus: ref(false),
        }
    }
}
</script>