<script setup>
import { MessageService } from "@/service/MessageService";
import { FilterMatchMode } from "@primevue/core/api";
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";

const filters = ref(null);
const loading = ref(null);
const messageItems = ref(null);
const route = useRoute();

onBeforeMount(() => {
  MessageService.getMessages(route.params.id).then((response) => {
    loading.value = false;
    messageItems.value = response.data;
  });

  initFilters();
});

function initFilters() {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };
}
</script>

<template>
  <div class="card">
    <div class="font-semibold text-xl mb-4">Messages</div>
    <DataTable
      stripedRows
      sortable
      :value="messageItems"
      :paginator="true"
      :rows="10"
      dataKey="id"
      :rowHover="true"
      v-model:filters="filters"
      :loading="loading"
      :filters="filters"
      :globalFilterFields="[
        'alias',
        'lastMsg',
        'lastMsgStatus',
        'lastMsgDate',
        'msgCount',
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
      <Column
        field="msgCount"
        header="Message Count"
        style="min-width: 12rem"
        :sortable="true"
      >
        <template #body="{ data }">
          {{ data.msgCount }}
        </template>
      </Column>
      <Column
        field="lastMsg"
        header="Last Message Text"
        style="min-width: 12rem"
        :sortable="true"
      >
        <template #body="{ data }">
          {{ data.lastMsg }}
        </template>
      </Column>
      <Column
        field="lastMsgStatus"
        header="Last Message Status"
        style="min-width: 12rem"
        :sortable="true"
      >
        <template #body="{ data }">
          {{ data.lastMsgStatus }}
        </template>
      </Column>
      <Column
        field="lastMsgDate"
        header="Last Message Date"
        style="min-width: 12rem"
        :sortable="true"
      >
        <template #body="{ data }">
          {{ data.lastMsgDate }}
        </template>
      </Column>
    </DataTable>
  </div>
</template>
