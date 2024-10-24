<script setup>
import { DeviceService } from "@/service/DeviceService";
import { FilterMatchMode } from "@primevue/core/api";
import { onBeforeMount, reactive, ref } from "vue";

const filters1 = ref(null);
const loading1 = ref(null);
const devices = ref(null);
const device = ref({});
const deleteDeviceDialog = ref(false);

function getSeverity(status) {
  return "info";
}

onBeforeMount(() => {
  DeviceService.getDevices().then((response) => {
    loading1.value = false;
    devices.value = response.data;
  });

  initFilters1();
});

function initFilters1() {
  filters1.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };
}

function confirmDeleteDevice(dev) {
  device.value = dev;
  deleteDeviceDialog.value = true;
}
</script>

<template>
  <div class="card">
    <div class="font-semibold text-xl mb-4">Devices</div>
    <DataTable
      stripedRows
      sortable
      :value="devices"
      :paginator="true"
      :rows="10"
      dataKey="id"
      :rowHover="true"
      v-model:filters="filters1"
      :loading="loading1"
      :filters="filters1"
      :globalFilterFields="['Tags', 'os', 'deviceToken', 'alias']"
      showGridlines
      :rowsPerPageOptions="[5, 10, 25]"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
    >
      <template #header>
        <div class="flex justify-between">
          <Button
            type="button"
            icon="pi pi-filter-slash"
            label="Clear"
            outlined
            @click="clearFilter()"
          />
          <IconField>
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="filters1['global'].value" placeholder="Keyword Search" />
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
      <Column header="Device Token" style="min-width: 12rem" :sortable="true">
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <span class="text-wrap text-break" style="word-break: break-all">{{
              data.deviceToken
            }}</span>
          </div>
        </template>
      </Column>
      <Column :sortable="true" header="Operation System" style="min-width: 14rem">
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <span>{{ data.os }}</span>
          </div>
        </template>
      </Column>
      <Column header="Tags" style="min-width: 12rem">
        <template #body="{ data }">
          <span v-for="(tag, index) in data.tags" :key="index" class="gap-1">
            <Tag :value="tag" :severity="getSeverity(tag)" />
          </span>
        </template>
      </Column>
      <Column
        :sortable="true"
        field="verified"
        header="Enabled?"
        dataType="boolean"
        bodyClass="text-center"
        style="min-width: 8rem"
      >
        <template #body="{ data }">
          <i
            class="pi"
            :class="{
              'pi-check-circle text-green-500 ': data.status,
              'pi-times-circle text-red-500': !data.status,
            }"
          ></i>
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
            @click="editDevice(data)"
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
      <Button label="Yes" icon="pi pi-check" @click="deleteDevice" />
    </template>
  </Dialog>
</template>
