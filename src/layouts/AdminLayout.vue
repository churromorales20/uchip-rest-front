<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-admin-light text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          Uchip REST
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <div class="admin-menu">
        <q-list>
          <q-item v-for="menu in uAdmin.menuItems" :key="'_menu_item_' + menu.id">
            <router-link class="admin-menu-item" :to="{ path: '/admin/' + menu.link }" v-if="menu.children === null || menu.children.length === 0">
              <q-icon :name="menu.icon"></q-icon>
              <span>{{ menu.title }}</span>
            </router-link>
            <q-expansion-item v-else>
              <template v-slot:header>
                <q-item class="admin-menu-item admin-menu-item-parent"><q-icon :name="menu.icon"></q-icon> {{ menu.title }}</q-item>
              </template>
              <q-list>
                <q-item v-for="submenu in menu.children" :key="'_menu_item_' + submenu.id" @click="select(subitem)">
                  <router-link class="admin-menu-item" :to="{ path: '/admin/' + submenu.link }">       
                    <q-icon :name="submenu.icon"></q-icon>
                    <span>{{ submenu.title }}</span>
                  </router-link>
                </q-item>
              </q-list>
            </q-expansion-item>
          </q-item>
        </q-list>
      </div>
    </q-drawer>

    <q-page-container class="admin-page-container">
      <AdminOrderDialog />
      <AdminBubbleNotifications />
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { ref } from 'vue'
import { useAdminUserStore } from 'stores/admin_user'
import AdminOrderDialog from '../components/admin/OrderDialog.vue';
import AdminBubbleNotifications from '../components/admin/BubbleNotifications.vue';
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import { uchipRequest } from '../utils/uchipRequest';
export default {
  name: 'AdminLayout',
  displayName: 'AdminLayout',
  components:{
    AdminOrderDialog,
    AdminBubbleNotifications
  },
  provide() {
    return {
      laravelEcho: this.laravel_echo
    }
  },
  setup() {
    window.Pusher = Pusher
    const leftDrawerOpen = ref(true)
    const uAdmin = useAdminUserStore()
    const laravel_echo = new Echo({
      broadcaster: 'pusher',
      key: 'ASDASD4540',
      cluster: '',
      forceTLS: false,
      encrypted: false,
      wsHost: window.location.hostname,
      wssPort: 6001,
      wsPort: 6001,
      disableStats: true,
      enabledTransports: ['ws'],
      authorizer: (channel, options) => {
        return {
          authorize: (socketId, callback) => {
            uchipRequest.broadcastAuth(socketId, channel.name, callback);
            /*axios.post('/api/broadcasting/auth', {
              socket_id: socketId,
              channel_name: channel.name
            })
              .then(response => {
                callback(null, response.data);
              })
              .catch(error => {
                callback(error);
              });*/
          }
        };
      },
      /*authEndpoint: 'sssssroadcasting/auth',
      auth: {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("user_admin_token")
        }
      }*/
    });
    return {
      uAdmin,
      leftDrawerOpen,
      laravel_echo,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
}
</script>