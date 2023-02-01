<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-secondary text-white">
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
        <ul>
          <li v-for="(menu, index_menu) in uAdmin.menuItems" :key="'_menu_item_' + index_menu">
            <a :href="menu.link">
              <q-icon :name="menu.icon"></q-icon>
              <span>{{ menu.name }}</span>
            </a>
          </li>
        </ul>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { ref } from 'vue'
import { useAdminUserStore } from 'stores/admin_user'

export default {
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