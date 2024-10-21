<script setup>
import { reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import { ApplicationService } from "@/service/ApplicationService";
import { useForm, useField, Form } from "vee-validate";
import * as yup from "yup";

const application = reactive({
  applicationName: "",
  apiKey: "",
  description: "",
});
const route = useRoute();

const schema = yup.object({
  applicationName: yup.string().required("'Application Name' required").max(50),
  description: yup.string().required("'Description' required").max(50),
  apiKey: yup.string().required("'ApiKey' required").max(50),
});

const { defineField, handleSubmit, errors, setValues } = useForm({
  initialValues: application,
  validationSchema: schema,
});

const submitForm = handleSubmit((values) => {
  console.log("Form submitted:", values);
});

onMounted(() => {
  ApplicationService.getApplication(route.params.id).then((response) => {
    application.value = response;
    setValues({
      applicationName: application.value.applicationName,
      apiKey: application.value.apiKey,
      description: application.value.description,
    });
  });
});

const [applicationName, applicationNameAttr] = defineField("applicationName");
const [apiKey, apiKeyAttr] = defineField("apiKey");
const [description, descriptionAttr] = defineField("description");
</script>

<template>
  <div class="font-semibold text-xl mb-12">Message Info {{ $route.params.id }}</div>
  <Form @submit="submitForm">
    <div class="flex flex-col md:flex-row gap-8" v-if="application.value">
      <div class="md:w-1/2">
        <div class="card flex flex-col gap-4">
          <div class="font-semibold text-xl">Edit Application</div>
          <div class="flex flex-col gap-2">
            <label for="name1">Application Name</label>
            <InputText
              id="applicationName"
              type="text"
              v-model="applicationName"
              v-bind="applicationNameAttr"
            />
            <Message severity="error" v-if="errors.applicationName">{{
              errors.applicationName
            }}</Message>
          </div>
          <div class="flex flex-col gap-2">
            <label for="email1">Description</label>
            <InputText
              id="description"
              type="text"
              v-model="description"
              v-bind="descriptionAttr"
            />
            <Message severity="error" v-if="errors.description">{{
              errors.description
            }}</Message>
          </div>
          <div class="flex flex-col gap-2">
            <label for="age1">Api Key</label>
            <InputText id="apiKey" type="text" v-model="apiKey" v-bind="apiKeyAttr" />
            <Message severity="error" v-if="errors.apiKey">{{ errors.apiKey }}</Message>
          </div>
          <h4>Credentials</h4>
          <Divider />

          <Button label="Submit" type="submit" :fluid="false"></Button>
        </div>
      </div>
    </div>
    <div v-else>Loading data</div>
  </Form>
</template>
