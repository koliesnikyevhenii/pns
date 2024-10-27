<script setup>
import { reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import { ApplicationService } from "@/service/ApplicationService";
import { useForm, Form } from "vee-validate";
import { useToast } from "primevue/usetoast";
import * as yup from "yup";

const IOS = 2;
const AndroidOS = 1;

const route = useRoute();
const toast = useToast();

const isNew = route.params.id == null;

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
  const file = event.files[0]; // Get the selected file
  if (file) {
    setValues({ p12FileName: file.name });
    convertFileToBase64(file, p12File); // Convert the file to Base64
  }
};
const onUploadServiceAccount = (event) => {
  const file = event.files[0]; // Get the selected file
  if (file) {
    setValues({ serviceAccountFileName: file.name });
    convertFileToBase64(file, serviceAccountFile); // Convert the file to Base64
  }
};
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
  if (!isNew) {
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
  }
});

const [applicationName, applicationNameAttr] = defineField("applicationName");
const [apiKey, apiKeyAttr] = defineField("apiKey");
const [isIOS, isIOSAttr] = defineField("isIOS");
const [isAndroid, isAndroidAttr] = defineField("isAndroid");
const [description, descriptionAttr] = defineField("description");
const [isProd, isProdAttr] = defineField("isProd");
const [p12File] = defineField("p12File");
const [p12FileName] = defineField("p12FileName");
const [appBundleId, appBundleIdAttr] = defineField("appBundleId");
const [password, passwordAttr] = defineField("password");
const [serviceAccountFile] = defineField("serviceAccountFile");
const [serviceAccountFileName] = defineField("serviceAccountFileName");
</script>

<template>
  <Form @submit="submitForm">
    <div class="flex flex-col md:flex-row gap-8" v-if="true">
      <div class="md:w-1/2">
        <div class="card flex flex-col gap-4">
          <div class="font-semibold text-xl">
            {{ isNew ? "New Application" : "Edit Application " + $route.params.id }}
          </div>
          <div class="flex flex-col gap-2">
            <label v-if="!isNew" for="applicationName">Application Name</label>
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
            <label for="description">Description</label>
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
            <label for="apiKey">Api Key</label>
            <InputText id="apiKey" type="text" v-model="apiKey" v-bind="apiKeyAttr" />
            <Message severity="error" v-if="errors.apiKey">{{ errors.apiKey }}</Message>
          </div>
          <h4>Credentials</h4>
          <Divider />

          <div class="flex flex-col gap-2">
            <Fieldset legend="Android Platform" :toggleable="false">
              <div class="flex flex-col gap-2">
                <label for="android">Enabled?</label>
                <ToggleSwitch
                  inputId="android"
                  v-model="isAndroid"
                  v-bind="isAndroidAttr"
                />
                <template v-if="isAndroid">
                  <label for="serviceAccountFile">Service Account File</label>
                  <FileUpload
                    mode="basic"
                    name="serviceAccountFile"
                    :maxFileSize="10000000"
                    :customUpload="true"
                    @select="onUploadServiceAccount"
                    class="custom-file-upload"
                  />
                  <p v-if="serviceAccountFileName">
                    Selected File: {{ serviceAccountFileName }}
                  </p>
                </template>
              </div>
            </Fieldset>
          </div>
          <div class="flex flex-col gap-2">
            <Fieldset legend="IOS Platform" :toggleable="false">
              <div class="flex flex-col gap-2">
                <label for="ios">Enabled?</label>
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
          <div>
            <Button label="Submit" type="submit" :fluid="false"></Button>
          </div>
        </div>
      </div>
    </div>
    <div v-else>Loading data</div>
    <Toast />
  </Form>
</template>

<style scoped>
.custom-file-upload input[type="file"] {
  display: none;
}
.p-fileupload-basic {
  justify-content: flex-start;
}
</style>

<style>
.p-fileupload span[files] {
  display: none;
}
</style>
