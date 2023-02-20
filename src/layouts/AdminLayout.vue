<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-admin-light text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          Title
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
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { ref } from 'vue'
import { useAdminUserStore } from 'stores/admin_user'
import AdminOrderDialog from '../components/admin/OrderDialog.vue';
export default {
  name: 'AdminLayout',
  displayName: 'AdminLayout',
  components:{
    AdminOrderDialog
  },
  setup() {
    const leftDrawerOpen = ref(true)
    const uAdmin = useAdminUserStore()

    return {
      uAdmin,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
}
</script>