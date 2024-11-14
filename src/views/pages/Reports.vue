<script setup>
import { removeSpacesFromObjectKeys } from "@/helpers/helpers";
import { ReportService } from "@/service/ReportService";
import { FilterMatchMode } from "@primevue/core/api";
import { onBeforeMount, watch, ref } from "vue";
import { useRoute } from "vue-router";
import { format, parse } from "date-fns";

const filters = ref(null);
const loading = ref(false);
const reportItems = ref(null);
const route = useRoute();
const page = ref(1);
const pageSize = ref(10);
const totalRecords = ref(0);
const searchString = ref('');

function getSeverity(status) {
  return "info";
}

//searching and pagination currently work on the frontend
// watch([page, pageSize, searchString], () => {
//   loadReports();
// })

onBeforeMount(() => {
  loadReports();
  initFilters();
});

function loadReports() {
  loading.value = true;
  ReportService.getReports(route.params.appId, page.value, pageSize.value, route.params.reportId, searchString.value).then((response) => {
    loading.value = false;
    reportItems.value = response.data.results.map(removeSpacesFromObjectKeys);
    totalRecords.value = response.data.totalCount;
  })
}

function initFilters() {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };
}
</script>

<template>
  <div class="card">
    <div class="font-semibold text-xl mb-4">Report Message by Tags</div>
    <!-- to enable backend pagination need to add 
      :lazy="true"
      @update:rows="(event) => pageSize = event"
      @page="(event) => page = event.page" 
    -->
    <DataTable
      stripedRows
      sortable
      :value="reportItems"
      :paginator="true"
      :totalRecords="totalRecords"
      :rows="pageSize"
      dataKey="id"
      :rowHover="true"
      v-model:filters="filters"
      :loading="loading"
      :filters="filters"
      :globalFilterFields="['Day', 'TagName', 'NumberOfMessageSent']"
      showGridlines
      :rowsPerPageOptions="[5, 10, 25]"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} reports"
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
      <template #empty> No reports found. </template>
      <template #loading> Loading reports data. Please wait. </template>
      <Column field="Day" header="Day" style="min-width: 12rem" :sortable="true">
        <template #body="{ data }">
          {{ format(parse(data.Day, "dd.MM.yyyy HH:mm:ss", new Date()), "dd.MM.yyyy") }}
        </template>
      </Column>
      <Column header="Tag Name" field="TagName" style="min-width: 12rem" :sortable="true">
        <template #body="{ data }">
          <Tag :value="data.TagName" :severity="getSeverity()" />
        </template>
      </Column>
      <Column
        header="Number Of Message Sent"
        field="NumberOfMessageSent"
        style="min-width: 12rem"
        :sortable="true"
      >
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <span class="text-wrap text-break" style="word-break: break-all">{{
              data.NumberOfMessageSent
            }}</span>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
