<template>
  <div v-if="!uAdminStore.isCsrfLoaded" class="main-wrapper">
    <q-circular-progress indeterminate size="200px" :thickness="0.1" rounded color="secondary" track-color="grey-3"
      class="q-ma-md" />
  </div>
  <div v-else class="admin-login-layout">
    <div class="admin-login-box">
      <router-view />
    </div>
  </div>
</template>

<script>
import { useAdminUserStore } from 'stores/admin_user';
export default {
  setup(){
    const uAdminStore = useAdminUserStore();
    uAdminStore.checkUser();
    return {
      uAdminStore
    }
  }
}
</script>