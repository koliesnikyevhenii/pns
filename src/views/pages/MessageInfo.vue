<script setup>
import { reactive, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { ApplicationService } from "@/service/ApplicationService";
import { useForm, useField, Form } from "vee-validate";
import { useToast } from "primevue/usetoast";
import * as yup from "yup";

const IOS = 2;
const AndroidOS = 1;

const application = reactive({
  applicationName: "",
  apiKey: "",
  description: "",
  isIOS: true,
  isAndroid: true,
  isProd: false,
  p12File: "",
  appBundleId: "",
  password: "",
  serviceAccountFile: "",
});

const route = useRoute();
const toast = useToast();

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

  toast.add({
    severity: "info",
    summary: "Success",
    detail: "Form data send",
    life: 3000,
  });
});

const onUploadp12 = (event) => {
  console.log("I am here");
  const file = event.files[0]; // Get the selected file
  if (file) {
    setValues({ p12FileName: file.name });
    convertFileToBase64(file, p12File); // Convert the file to Base64
  }
};

// Convert the file to Base64 using FileReader
const convertFileToBase64 = (file, prop) => {
  const reader = new FileReader();
  reader.readAsDataURL(file); // Read the file as a Data URL (Base64)

  // When the file is successfully read, store the result (Base64 string)
  reader.onload = () => {
    prop.value = reader.result;
  };

  reader.onerror = (error) => {
    toast.add({
      severity: "error",
      summary: "Error reading file",
      detail: error,
      life: 3000,
    });
  };
};

onMounted(() => {
  ApplicationService.getApplication(route.params.id).then((response) => {
    application.value = response;
    setValues({
      applicationName: application.value.applicationName,
      apiKey: application.value.apiKey,
      description: application.value.description,
    });
  });

  ApplicationService.getApplicationCreds(route.params.id).then((response) => {
    let appCreds = response.credentials;
    let android = appCreds.filter((creds) => creds.os == AndroidOS)[0] || null;
    let ios = appCreds.filter((creds) => creds.os == IOS)[0] || null;

    setValues({
      isIOS: ios != null,
      isAndroid: android != null,
      isProd: ios.environment == 2, //TODO: check this moment on server side why is 2 ??!!
      p12File: ios?.fileData,
      p12FileName: ios?.key,
      appBundleId: ios?.appBundleId,
      password: ios?.password,
      serviceAccountFile: android?.fileData,
      serviceAccountFileName: android?.key,
      uploadedFiles: [],
    });
  });
});

const [applicationName, applicationNameAttr] = defineField("applicationName");
const [apiKey, apiKeyAttr] = defineField("apiKey");
const [isIOS, isIOSAttr] = defineField("isIOS");
const [isAndroid, isAndroidAttr] = defineField("isAndroid");
const [description, descriptionAttr] = defineField("description");
const [isProd, isProdAttr] = defineField("isProd");
const [p12File, p12FileAttr] = defineField("p12File");
const [p12FileName, p12FilenameAttr] = defineField("p12FileName");
const [appBundleId, appBundleIdAttr] = defineField("appBundleId");
const [password, passwordAttr] = defineField("password");
const [serviceAccountFile, serviceAccountFileAttr] = defineField("serviceAccountFile");
const [serviceAccountFileName, serviceAccountFileNameAttr] = defineField(
  "serviceAccountFileName"
);

//const [uploadedFiles, uploadedFilesAttr] = defineField("uploadedFiles");
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
                <ToggleSwitch
                  inputId="android"
                  v-model="isAndroid"
                  v-bind="isAndroidAttr"
                />
                <template v-if="isAndroid">
                  <label for="serviceAccountFile">Service Account File</label>
                  <InputText
                    id="serviceAccountFile"
                    type="text"
                    v-model="serviceAccountFile"
                    v-bind="serviceAccountFileAttr"
                  />
                </template>
              </div>
            </Fieldset>
          </div>
          <div class="flex flex-col gap-2">
            <Fieldset legend="IOS Platform" :toggleable="false">
              <div class="flex flex-col gap-2">
                <label for="ios">Turn On/Off</label>
                <ToggleSwitch inputId="ios" v-model="isIOS" v-bind="isIOSAttr" />
                <template v-if="isIOS">
                  <label for="p12File">P12 File</label>

                  <FileUpload
                    mode="basic"
                    name="f12file"
                    :maxFileSize="10000000"
                    :customUpload="true"
                    @select="onUploadp12"
                    class="custom-file-upload"
                  />

                  <p v-if="p12FileName">Selected File: {{ p12FileName }}</p>

                  <label for="password">Password</label>
                  <InputText
                    id="password"
                    type="text"
                    v-model="password"
                    v-bind="passwordAttr"
                  />
                  <label for="password">App Bundle Id</label>
                  <InputText
                    id="appBundleId"
                    type="text"
                    v-model="appBundleId"
                    v-bind="appBundleIdAttr"
                  />
                  <label for="prod">Prodcution Environment</label>
                  <ToggleSwitch inputId="prod" v-model="isProd" v-bind="isProdAttr" />
                </template>
              </div>
            </Fieldset>
          </div>
          <Button label="Submit" type="submit" :fluid="false"></Button>
        </div>
      </div>
    </div>
    <div v-else>Loading data</div>
    <Toast />
  </Form>
</template>

<style scoped>
/* Hide the native file input (which shows "No file chosen") */
.custom-file-upload input[type="file"] {
  display: none;
}
</style>
>
