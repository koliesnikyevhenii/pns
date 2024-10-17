<script setup>
import { ref } from "vue";

import AppMenuItem from "./AppMenuItem.vue";

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
        icon: "pi pi-fw pi-bookmark",
        items: [
          {
            label: "Send Message",
            icon: "pi pi-fw pi-bookmark",
            to: "/message",
          },
          {
            label: "Message by Alias",
            icon: "pi pi-fw pi-bookmark",
            to: "/messagebyalias",
          },
        ],
      },
      {
        label: "Devices",
        icon: "pi pi-fw pi-bookmark",
        to: "/devices",
      },
      {
        label: "Actions",
        icon: "pi pi-fw pi-bookmark",
        to: "/actions",
      },
      {
        label: "Reports",
        icon: "pi pi-fw pi-bookmark",
        items: [
          {
            label: "Messages by tags",
            icon: "pi pi-fw pi-bookmark",
            to: "/reports",
          },
        ],
      },
    ],
  },
]);
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="item">
      <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
      <li v-if="item.separator" class="menu-separator"></li>
    </template>
  </ul>
</template>

<style lang="scss" scoped></style>
