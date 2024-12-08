<script setup>
import { FilterMatchMode } from "@primevue/core/api";
import { onBeforeMount, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { format } from "date-fns";
import { useToast } from "primevue/usetoast";
import { MessageStatuses } from "@/constants/enums";
import { useStore } from "vuex";
import { useMessageList } from "@/composables/useMessageList";

const toast = useToast();
const filters = ref(null);
const route = useRoute();
const router = useRouter();
const selectedRow = ref(null);
const store = useStore();

const { loading, messageList } = useMessageList(() => store.getters.getApiKeyForApp(route.params.appId), toast, router, route);

function onRowSelect() {
  router.push({
    name: 'messageList',
    params: {
      appId: route.params.appId,
      alias: selectedRow.value.alias
    }
  });
}

onBeforeMount(() => {
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
      :value="messageList"
      :paginator="true"
      :rows="10"
      dataKey="id"
      :rowHover="true"
      v-model:filters="filters"
      :loading="loading"
      :filters="filters"
      :globalFilterFields="[
        'alias',
        'lastMessageText',
        'lastMessageStatus',
        'lastMessageDate',
        'numMessages',
      ]"
      showGridlines
      :rowsPerPageOptions="[5, 10, 25]"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} messages"
      v-model:selection="selectedRow"
      selectionMode="single"
      @rowSelect="onRowSelect"
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
      <template #empty> No messages found. </template>
      <template #loading> Loading messages data. Please wait. </template>
      <Column field="alias" header="Alias" style="min-width: 12rem" :sortable="true">
        <template #body="{ data }">
          {{ data.alias }}
        </template>
      </Column>
      <Column
        field="numMessages"
        header="Message Count"
        style="min-width: 12rem"
        :sortable="true"
      >
        <template #body="{ data }">
          {{ data.numMessages }}
        </template>
      </Column>
      <Column
        field="lastMessageText"
        header="Last Message Text"
        style="min-width: 12rem"
        :sortable="true"
      >
        <template #body="{ data }">
          {{ data.lastMessageText }}
        </template>
      </Column>
      <Column
        field="lastMessageStatus"
        header="Last Message Status"
        style="min-width: 12rem"
        :sortable="true"
      >
        <template #body="{ data }">
          {{ MessageStatuses[data.lastMessageStatus] }}
        </template>
      </Column>
      <Column
        field="lastMessageDate"
        header="Last Message Date"
        style="min-width: 12rem"
        :sortable="true"
      >
        <template #body="{ data }">
          {{ format(new Date(data.lastMessageDate), "yyyy-MM-dd HH:mm") }}
        </template>
      </Column>
    </DataTable>
    <!-- <Toast /> -->
  </div>
</template>
