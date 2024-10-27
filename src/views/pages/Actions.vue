<script setup>
import { ActionService } from "@/service/ActionService";
import { FilterMatchMode } from "@primevue/core/api";
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";

const filters = ref(null);
const loading = ref(null);
const actionItems = ref(null);
const action = ref({});
const newAction = ref({});
const deleteActionDialog = ref(false);
const createActionDialog = ref(false);
const route = useRoute();

function confirmDeleteAction(action) {
  action.value = action;
  deleteActionDialog.value = true;
}

function showActionDialog() {
  createActionDialog.value = true;
}

function deleteAction() {
  //TODO: add delete logic
  console.log("deleteAction");
}

function createAction() {
  //TODO: add delete logic
  console.log("createAction");
  resetAction();
}

function resetAction() {
  newAction.value = {};
  createActionDialog.value = false;
}

onBeforeMount(() => {
  ActionService.getActions(route.params.id).then((response) => {
    loading.value = false;
    actionItems.value = response.data;
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
    <div class="font-semibold text-xl mb-4">Actions</div>
    <div class="flex mb-4">
      <Button
        type="button"
        icon="pi pi-file-plus"
        label="Add Action"
        outlined
        @click="showActionDialog"
      />
    </div>

    <DataTable
      stripedRows
      sortable
      :value="actionItems"
      :paginator="true"
      :rows="10"
      dataKey="id"
      :rowHover="true"
      v-model:filters="filters"
      :loading="loading"
      :filters="filters"
      :globalFilterFields="['action', 'description']"
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
      <Column field="action" header="Action" style="min-width: 12rem" :sortable="true">
        <template #body="{ data }">
          {{ data.action }}
        </template>
      </Column>
      <Column
        header="Description"
        field="description"
        style="min-width: 12rem"
        :sortable="true"
      >
        <template #body="{ data }">
          {{ data.description }}
        </template>
      </Column>
      <Column field="NumberOfMessageSent" style="min-width: 12rem">
        <template #body="{ data }">
          <Button
            icon="pi pi-trash"
            outlined
            rounded
            severity="danger"
            @click="confirmDeleteAction(data)"
          />
        </template>
      </Column>
    </DataTable>
  </div>

  <Dialog
    v-model:visible="deleteActionDialog"
    :style="{ width: '450px' }"
    header="Confirm"
    :modal="true"
  >
    <div class="flex items-center gap-4">
      <i class="pi pi-exclamation-triangle !text-3xl" />
      <span v-if="action"
        >Are you sure you want to delete <b>{{ action.action }}</b
        >?</span
      >
    </div>
    <template #footer>
      <Button label="No" icon="pi pi-times" text @click="deleteActionDialog = false" />
      <Button label="Yes" icon="pi pi-check" @click="deleteAction" />
    </template>
  </Dialog>

  <Dialog
    v-model:visible="createActionDialog"
    :style="{ width: '450px' }"
    header="Create Action"
    :modal="true"
  >
    <div class="flex items-center gap-4">
      <div class="flex flex-col gap-2">
        <label for="actionName">Action Name</label>
        <InputText id="actionName" type="text" />
        <label for="description">Description</label>
        <InputText id="description" type="text" />
      </div>
    </div>
    <template #footer>
      <Button label="No" icon="pi pi-times" text @click="resetAction" />
      <Button label="Yes" icon="pi pi-check" @click="createAction" />
    </template>
  </Dialog>
</template>
