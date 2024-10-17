<script setup>
import { DeviceService } from "@/service/DeviceService";
import { FilterMatchMode } from "@primevue/core/api";
import { onBeforeMount, reactive, ref } from "vue";

const filters1 = ref(null);
const loading1 = ref(null);
const devices = ref(null);

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
      :globalFilterFields="[
        'name',
        'country.name',
        'representative.name',
        'balance',
        'status',
      ]"
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
            @click="editProduct(slotProps.data)"
          />
          <Button
            icon="pi pi-trash"
            outlined
            rounded
            severity="danger"
            @click="confirmDeleteProduct(slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>
