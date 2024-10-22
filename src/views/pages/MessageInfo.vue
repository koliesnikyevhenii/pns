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
  isIOS: true,
  isAndroid: true,
  isProd: false,
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
  <div class="font-semibold text-xl mb-12">Application Edit {{ $route.params.id }}</div>
  <Form @submit="submitForm">
    <div class="flex flex-col md:flex-row w-full" v-if="application.value">
      <div class="w-full">
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

          <div class="flex flex-col gap-2">
            <Fieldset legend="Android Platform" :toggleable="false">
              <div class="flex flex-col gap-2">
                <label for="android">Turn On/Off</label>
                <ToggleSwitch inputId="android" v-model="application.isAndroid" />
                <label for="serviceAccountFile">Service Account File</label>
                <InputText
                  id="serviceAccountFile"
                  type="text"
                  v-model="apiKey"
                  v-bind="apiKeyAttr"
                />
              </div>
            </Fieldset>
          </div>
          <div class="flex flex-col gap-2">
            <Fieldset legend="IOS Platform" :toggleable="false">
              <div class="flex flex-col gap-2">
                <label for="ios">Turn On/Off</label>
                <ToggleSwitch inputId="ios" v-model="application.isIOS" />
                <label for="p12File">P12 File</label>
                <InputText
                  id="p12File"
                  type="text"
                  v-model="apiKey"
                  v-bind="apiKeyAttr"
                />
                <label for="password">Password</label>
                <InputText
                  id="password"
                  type="text"
                  v-model="apiKey"
                  v-bind="apiKeyAttr"
                />
                <label for="password">App Bundle Id</label>
                <InputText
                  id="appBundleId"
                  type="text"
                  v-model="apiKey"
                  v-bind="apiKeyAttr"
                />
                <label for="prod">Prodcution Environment</label>
                <ToggleSwitch inputId="prod" v-model="application.isProd" />
              </div>
            </Fieldset>
          </div>
          <Button label="Submit" type="submit" :fluid="false"></Button>
        </div>
      </div>
    </div>
    <div v-else>Loading data</div>
  </Form>
</template>
