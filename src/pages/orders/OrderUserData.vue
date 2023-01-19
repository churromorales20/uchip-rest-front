<template>
    <q-input v-model="uStore.name" label="Tu nombre" :dense="false">
        <template v-slot:prepend>
            <q-icon name="fa-solid fa-user" />
        </template>
    </q-input>
    <q-input class="withspace" v-model="uStore.phone" label="Numero telefonico" :dense="false">
        <template v-slot:prepend>
            <q-icon name="fa-solid fa-phone" />
        </template>
    </q-input>
    <q-input class="withspace" v-model="uStore.email" label="Correo electronico" :dense="false">
        <template v-slot:prepend>
            <q-icon name="fa-solid fa-envelope" />
        </template>
    </q-input>
</template>
<script>
import { defineComponent } from 'vue'
import { useOrdersStore } from 'stores/orders';
import { useUserStore } from 'stores/user'
export default defineComponent({
    name: 'OrderUserData',
    setup() {
        const oStore = useOrdersStore();
        const uStore = useUserStore();
        return {
            oStore,
            uStore,
        }
    }
})
</script>