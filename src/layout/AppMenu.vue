<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import AppMenuItem from "./AppMenuItem.vue";
import { ReportService } from "@/service/ReportService";

const route = useRoute();
// Show menu only on specific routes
const showMenu = computed(() => route.path.includes("/app/"));

const reports = ref(null);

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
            to: { name: 'message', params: { appId: route.params.appId } },
          },
          {
            label: "Message by Alias",
            icon: "pi pi-fw pi-book",
            to: { name: 'messagebyalias', params: { appId: route.params.appId } },
          },
        ],
      },
      {
        label: "Devices",
        icon: "pi pi-fw pi-tablet",
        to: { name: 'devices', params: { appId: route.params.appId } },
      },
      {
        label: "Actions",
        icon: "pi pi-fw pi-star",
        to: { name: 'actions', params: { appId: route.params.appId } },
      },
      {
        label: "Reports",
        icon: "pi pi-fw pi-folder",
        items: reports,
      },
    ],
  },
]);

onMounted(() => {
  ReportService.getReportTypes().then((response) => {
    reports.value = response.data.map(item => ({
      label: item.name,
      icon: "pi pi-fw pi-book",
      to: { name: 'reports', params: { appId: route.params.appId, reportId: item.id } },
    }));
  });
})
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
