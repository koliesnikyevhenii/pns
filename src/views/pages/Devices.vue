<script setup>
import { DeviceService } from "@/service/DeviceService";
import { FilterMatchMode } from "@primevue/core/api";
import { onBeforeMount, ref, watch } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const filters = ref(null);
const isLoading = ref(false);
const devices = ref(null);
const device = ref({});
const deleteDeviceDialog = ref(false);
const page = ref(0);
const pageSize = ref(10);
const totalRecords = ref(0);

function loadDevices() {
  isLoading.value = true;
  DeviceService.getDevices(page.value, pageSize.value).then((response) => {
    isLoading.value = false;
    devices.value = response.data;
    totalRecords.value = response.recordsTotal;
  });
}

function deleteDevice(deviceAlias) {
  DeviceService.deleteDevice(deviceAlias).then((response) => {
    deleteDeviceDialog.value = false;
  });
}

function sendMessage(deviceAlias) {
  router.push({
    path: "/app/23/message",
    state: {
      alias: deviceAlias,
    },
  });
}

function toggleDeviceStatus(device) {
  device.status = !device.status;
  DeviceService.changeDeviceStatus(device);
}

function initFilters() {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };
}

function confirmDeleteDevice(dev) {
  device.value = dev;
  deleteDeviceDialog.value = true;
}

watch([page, pageSize], () => {
  loadDevices();
})

onBeforeMount(() => {
  loadDevices();
  initFilters();
});
</script>

<template>
  <div class="card">
    <div class="font-semibold text-xl mb-4">Devices</div>
    <DataTable
      stripedRows
      sortable
      :value="devices"
      :paginator="true"
      :lazy="true"
      :totalRecords="totalRecords"
      :rows="pageSize"
      dataKey="id"
      :rowHover="true"
      v-model:filters="filters"
      :loading="isLoading"
      :filters="filters"
      :globalFilterFields="['Tags', 'os', 'deviceToken', 'alias', 'status']"
      showGridlines
      :rowsPerPageOptions="[5, 10, 25]"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} devices"
      @update:rows="(event) => pageSize = event"
      @page="(event) => page = event.page"
    >
      <template #header>
        <div class="flex justify-between">
          <IconField>
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
          </IconField>
        </div>
      </template>
      <template #empty> No device found. </template>
      <template #loading> Loading device data. Please wait. </template>
      <Column field="alias" header="Alias" style="min-width: 12rem" :sortable="true">
        <template #body="{ data }">
          {{ data.alias }}
        </template>
      </Column>
      <Column header="Device Token" style="min-width: 12rem">
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <span class="text-wrap text-break" style="word-break: break-all">{{
              data.deviceToken
            }}</span>
          </div>
        </template>
      </Column>
      <Column
        :sortable="true"
        field="os"
        header="Operation System"
        style="min-width: 14rem"
      >
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <span>{{ data.os }}</span>
          </div>
        </template>
      </Column>
      <Column header="Tags" style="min-width: 12rem">
        <template #body="{ data }">
          <span v-for="(tag, index) in data.tags" :key="index" class="gap-1 m-1">
            <Tag class="my-1" :value="tag" severity="info" />
          </span>
        </template>
      </Column>
      <Column
        :sortable="true"
        field="status"
        header="Enabled?"
        dataType="boolean"
        bodyClass="text-center"
        style="min-width: 8rem"
      >
        <template #body="{ data }">
          <ToggleSwitch
            :model-value="data.status == 1"
            @change="toggleDeviceStatus(data)"
          />
        </template>
      </Column>
      <Column
        field="activity"
        header="Actions"
        :showFilterMatchModes="false"
        style="min-width: 12rem"
      >
        <template #body="{ data }">
          <Button
            icon="pi pi-send"
            outlined
            rounded
            class="mr-2"
            @click="sendMessage(data.alias)"
          />
          <Button
            icon="pi pi-trash"
            outlined
            rounded
            severity="danger"
            @click="confirmDeleteDevice(data)"
          />
        </template>
      </Column>
    </DataTable>
  </div>

  <Dialog
    v-model:visible="deleteDeviceDialog"
    :style="{ width: '450px' }"
    header="Confirm"
    :modal="true"
  >
    <div class="flex items-center gap-4">
      <i class="pi pi-exclamation-triangle !text-3xl" />
      <span v-if="device"
        >Are you sure you want to delete <b>{{ device.alias }}</b
        >?</span
      >
    </div>
    <template #footer>
      <Button label="No" icon="pi pi-times" text @click="deleteDeviceDialog = false" />
      <Button label="Yes" icon="pi pi-check" @click="deleteDevice(device.alias)" />
    </template>
  </Dialog>
</template>
