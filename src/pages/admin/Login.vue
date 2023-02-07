<template>
    <div>
        <div>
            <q-input v-model="uAdminStore.logging_email" filled type="email" hint="Email">
                <template v-slot:prepend>
                    <q-icon name="fa-solid fa-envelope" />
                </template>
            </q-input>  
        </div>
        <div>
            <q-input v-model="uAdminStore.logging_password" filled :type="isPwd ? 'password' : 'text'" hint="Password with toggle">
                <template v-slot:prepend>
                    <q-icon name="fa-solid fa-lock" />
                </template>
                <template v-slot:append>
                    <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
                </template>
            </q-input>
        </div>
        <div>
            <q-btn 
                color="accent" 
                icon="fa fa-arrow-right"
                @click="uAdminStore.makeLogin()"
                :loading="uAdminStore.isMakingLogin" 
                :disable="uAdminStore.isMakingLogin" 
                label="Listo para ordenar!" 
                class="q-md" />
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue'
import { ref } from 'vue'
import { useAdminUserStore } from 'stores/admin_user';
//import { useUserStore } from 'stores/user';
export default defineComponent({
    name: 'AdminLogin',
    setup (){
        const uAdminStore = useAdminUserStore();
        return{
            uAdminStore,
            isPwd: ref(true),
        }
    }
})
</script>
