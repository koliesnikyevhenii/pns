<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import AppMenuItem from "./AppMenuItem.vue";

const route = useRoute();
// Show menu only on specific routes
const showMenu = computed(() => route.path.includes("/app/"));

const model = ref([
  {
    label: "Home",
    items: [{ label: "Applications", icon: "pi pi-fw pi-home", to: "/" }],
  },
  {
    label: "Hierarchy",
    items: [
      {
        label: "Messages",
        icon: "pi pi-fw pi-envelope",
        items: [
          {
            label: "Send Message",
            icon: "pi pi-fw pi-directions",
            to: "/app/23/message",
          },
          {
            label: "Message by Alias",
            icon: "pi pi-fw pi-book",
            to: "/app/23/messagebyalias",
          },
        ],
      },
      {
        label: "Devices",
        icon: "pi pi-fw pi-tablet",
        to: "/app/23/devices",
      },
      {
        label: "Actions",
        icon: "pi pi-fw pi-star",
        to: "/app/23/actions",
      },
      {
        label: "Reports",
        icon: "pi pi-fw pi-folder",
        items: [
          {
            label: "Messages by tags",
            icon: "pi pi-fw pi-book",
            to: "/app/23/reports",
          },
        ],
      },
    ],
  },
]);
</script>

<template>
  <ul class="layout-menu" v-if="showMenu">
    <template v-for="(item, i) in model" :key="item">
      <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
      <li v-if="item.separator" class="menu-separator"></li>
    </template>
  </ul>
</template>

<style lang="scss" scoped></style>
