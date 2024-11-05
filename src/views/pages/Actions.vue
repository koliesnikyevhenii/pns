<script setup>
import { ActionService } from "@/service/ActionService";
import { FilterMatchMode } from "@primevue/core/api";
import { onBeforeMount, ref } from "vue";
import { useForm, Form } from "vee-validate";
import { useToast } from "primevue/usetoast";
import { useRoute } from "vue-router";
import * as yup from "yup";

const route = useRoute();
const toast = useToast();

const filters = ref(null);
const loading = ref(null);
const actionItems = ref(null);
const action = ref({});
const deleteActionDialog = ref(false);
const createActionDialog = ref(false);

const schema = yup.object({
  actionName: yup.string().required("'Action name' required").max(50),
  description: yup.string().required("'Description' required").max(100),
});

const { defineField, handleSubmit, handleReset, errors } = useForm({
  initialValues: {
    actionName: "",
    description: "",
  },
  validationSchema: schema,
});

const submitForm = handleSubmit((values) => {
  ActionService.createAction(values).then((response) => {
    console.log(response);
  });

  toast.add({
    severity: "info",
    summary: "Success",
    detail: "Form data send",
    life: 3000,
  });

  resetForm();
});

const [actionName, actionNameAttr] = defineField("actionName");
const [description, descriptionAttr] = defineField("description");

function confirmDeleteAction(selectedAction) {
  action.value = selectedAction;
  deleteActionDialog.value = true;
}

function showActionDialog() {
  createActionDialog.value = true;
}

function deleteAction() {
  ActionService.deleteAction(action.value.id).then((response) => {
    console.log(response);
    deleteActionDialog.value = false;
  });
}

function resetForm() {
  handleReset();
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
    <Form @submit="submitForm">
      <div class="flex items-center gap-4">
        <div class="flex flex-col gap-2">
          <label for="actionName">Action Name</label>
          <InputText
            id="actionName"
            type="text"
            v-model="actionName"
            v-bind="actionNameAttr"
          />
          <Message severity="error" v-if="errors.actionName">
            {{ errors.actionName }}
          </Message>
          <label for="description">Description</label>
          <InputText
            id="description"
            type="text"
            v-model="description"
            v-bind="descriptionAttr"
          />
          <Message severity="error" v-if="errors.description">
            {{ errors.description }}
          </Message>
        </div>
      </div>
      <div class="flex justify-end space-x-2">
        <Button label="No" icon="pi pi-times" text @click="resetForm" />
        <Button label="Submit" type="submit" :fluid="false"></Button>
      </div>
      <Toast />
    </Form>
  </Dialog>
</template>
