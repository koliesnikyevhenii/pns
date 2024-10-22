<script setup>
import { useLayout } from "@/layout/composables/layout";
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";

const { getPrimary, getSurface, isDarkTheme } = useLayout();

const lineData = ref(null);
const lineOptions = ref(null);
const router = useRouter();
const appId = ref(24); // TODO: make it dynamic based on server request

function setColorOptions() {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue("--text-color");
  const textColorSecondary = documentStyle.getPropertyValue("--text-color-secondary");
  const surfaceBorder = documentStyle.getPropertyValue("--surface-border");
  lineData.value = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "PNS",
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        backgroundColor: documentStyle.getPropertyValue("--p-primary-500"),
        borderColor: documentStyle.getPropertyValue("--p-primary-500"),
        tension: 0.4,
      },
    ],
  };

  lineOptions.value = {
    plugins: {
      legend: {
        labels: {
          fontColor: textColor,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
          drawBorder: false,
        },
      },
      y: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
          drawBorder: false,
        },
      },
    },
  };
}

function editDevice(appId) {
  router.push({ name: "messageinfo", params: { id: appId } });
}

onMounted(() => {
  setColorOptions();
});

watch(
  [getPrimary, getSurface, isDarkTheme],
  () => {
    setColorOptions();
  },
  { immediate: true }
);
</script>

<template>
  <div class="grid grid-cols-12 gap-8">
    <div class="col-span-12 xl:col-span-6">
      <div class="card">
        <Button
          icon="pi pi-file-edit"
          outlined
          rounded
          class="mr-2"
          @click="editDevice(appId)"
        />
        <Button
          icon="pi pi-trash"
          outlined
          rounded
          severity="danger"
          @click="confirmDeleteDevice(data)"
        />
        <div class="font-semibold text-xl mb-4">App Name 1</div>
        <Chart type="line" :data="lineData" :options="lineOptions" class="h-80" />
      </div>
    </div>
    <div class="col-span-12 xl:col-span-6">
      <div class="card">
        <div class="font-semibold text-xl mb-4">App Name 2</div>
        <Chart type="line" :data="lineData" :options="lineOptions" class="h-80" />
      </div>
    </div>
    <div class="col-span-12 xl:col-span-6">
      <div class="card">
        <div class="font-semibold text-xl mb-4">App Name 3</div>
        <Chart type="line" :data="lineData" :options="lineOptions" class="h-80" />
      </div>
    </div>
    <div class="col-span-12 xl:col-span-6">
      <div class="card">
        <Button icon="pi pi-plus" class="btn btn-primary col-12" aria-label="Filter" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  padding: 4rem;
}
</style>
