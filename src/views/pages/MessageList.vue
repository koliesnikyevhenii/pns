<script setup>
import { MessageService } from "@/service/MessageService";
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import { format } from "date-fns";
import { MessageStatuses } from "@/constants/enums";

const alias = ref('');
const loading = ref(null);
const messageItems = ref(null);
const route = useRoute();

onBeforeMount(() => {
    loading.value = true;
    alias.value = route.params.alias;
    MessageService.getMessagesByAlias(alias.value).then((response) => {
        loading.value = false;
        messageItems.value = response.data;
  });
});

</script>

<template>
  <div class="card">
    <div class="font-semibold text-xl mb-4">Messages for alias {{ alias }}</div>
    <DataTable
      stripedRows
      :value="messageItems"
      :paginator="true"
      :rows="10"
      dataKey="id"
      :rowHover="true"
      :loading="loading"
      showGridlines
      :rowsPerPageOptions="[5, 10, 25]"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} messages"
    >
      <template #empty> No messages found. </template>
      <template #loading> Loading messages data. Please wait. </template>
      <Column field="id" header="Id" style="min-width: 12rem" sortable>
        <template #body="{ data }">
          {{ data.id }}
        </template>
      </Column>
      <Column
        field="header"
        header="Message Header"
        sortable
        style="min-width: 12rem"
      >
        <template #body="{ data }">
          {{ data.header }}
        </template>
      </Column>
      <Column
        field="text"
        header="Message Text"
        sortable
        style="min-width: 12rem"
      >
        <template #body="{ data }">
          {{ data.text }}
        </template>
      </Column>
      <Column
        field="status"
        header="Status"
        style="min-width: 12rem"
        :sortable="true"
      >
        <template #body="{ data }">
          {{ MessageStatuses[data.status] }}
        </template>
      </Column>
      <Column
        field="sendErrorDesc"
        header="Send Error Description"
        style="min-width: 12rem"
        :sortable="true"
      >
        <template #body="{ data }">
          {{ data.sendErrorDesc }}
        </template>
      </Column>
      <Column
        field="messageDate_Unix"
        header="Date"
        sortable
        style="min-width: 12rem"
      >
        <template #body="{ data }">
          {{ format(new Date(data.messageDate_Unix), "yyyy-MM-dd HH:mm") }}
        </template>
      </Column>
    </DataTable>
  </div>
</template>