<script setup>
import { reactive, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { ApplicationService } from '@/service/ApplicationService';
import { useForm, Form } from 'vee-validate';
import { useToast } from 'primevue/usetoast';
import * as yup from 'yup';

const IOS = 2;
const AndroidOS = 1;

const MAX_FILE_SIZE = 4000000;

const route = useRoute();
const router = useRouter();
const toast = useToast();

const isNew = route.params.id == null;

const credentialsAndroid = ref(null);
const credentialsIOS = ref(null);

const application = reactive({
    applicationName: '',
    apiKey: '',
    description: '',
    isIOS: false,
    isAndroid: false,
    isProd: false,
    p12File: null,
    appBundleId: '',
    password: '',
    serviceAccountFile: null
});

const schema = yup.object({
    applicationName: yup.string().required("'Application Name' required").max(50),
    description: yup.string().required("'Description' required").max(50),
    isAndroid: yup.boolean(),
    serviceAccountFile: yup.mixed().when('isAndroid', {
        is: true,
        then: (f) => f.required("'Service Account File' required"),
        otherwise: (f) => f.notRequired()
    }),
    isIOS: yup.boolean(),
    p12File: yup.mixed().when('isIOS', {
        is: true,
        then: (f) => f.required("'P12 File' required"),
        otherwise: (f) => f.notRequired()
    }),
    password: yup.string().when('isIOS', {
        is: true,
        then: (p) => p.required("'Password' required").max(50),
        otherwise: (p) => p.notRequired()
    })
});

const { defineField, handleSubmit, errors, setValues } = useForm({
    initialValues: application,
    validationSchema: schema
});

const submitForm = handleSubmit((values) => {
    const appRequest = {
        name: values.applicationName,
        description: values.description
    };

    if (isNew) {
        ApplicationService.addApp(appRequest).then((response) => {
            if (response.data?.id) {
                toast.add({
                    severity: 'info',
                    summary: 'Success',
                    detail: 'Application created',
                    life: 3000
                });

                updateCredentials(response.data, values);
            }
        });
    } else {
        ApplicationService.editApp(route.params.id, appRequest).then((response) => {
            if (response.data?.id) {
                toast.add({
                    severity: 'info',
                    summary: 'Success',
                    detail: 'Application details saved',
                    life: 3000
                });

                updateCredentials(response.data, values);
            }
        });
    }
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
            severity: 'error',
            summary: 'Error reading file',
            detail: error,
            life: 3000
        });
    };
};

function setAppData(appData) {
    let appCreds = appData.credentials;
    let android = appCreds.filter((creds) => creds.os == AndroidOS)[0] || null;
    let ios = appCreds.filter((creds) => creds.os == IOS)[0] || null;

    setValues({
        applicationName: appData.name,
        apiKey: appData.apiKey,
        description: appData.description,
        isIOS: ios != null,
        isAndroid: android != null,
        isProd: ios?.environment == 2, //TODO: check this moment on server side why is 2 ??!!
        p12File: ios?.fileData,
        p12FileName: ios?.key,
        appBundleId: ios?.appBundleId,
        password: ios?.password,
        serviceAccountFile: android?.fileData,
        serviceAccountFileName: android?.key
    });

    credentialsAndroid.value = android;
    credentialsIOS.value = ios;
}

async function updateCredentials(appData, values) {
    appData.credentials = [];

    if (values.isAndroid) {
        const androidCredsRequest = {
            os: 1,
            key: values.serviceAccountFileName,
            fileData: values.serviceAccountFile?.split('base64,')[1] || values.serviceAccountFile
        };

        const response = await ApplicationService.postCredentials(appData.id, androidCredsRequest);
        if (response.data) {
            appData.credentials.push(response.data);
        }
    } else if (credentialsAndroid.value) {
        const response = await ApplicationService.deleteCredentials(appData.id, credentialsAndroid.value);
        if (response.data == 'OK') {
            toast.add({
                severity: 'info',
                summary: 'Success',
                detail: 'Android credentials removed',
                life: 3000
            });
        }
    }

    if (values.isIOS) {
        const iOSCredsRequest = {
            os: 2,
            key: values.p12FileName,
            fileData: values.p12File?.split('base64,')[1] || values.p12File,
            password: values.password,
            appBundleId: values.appBundleId
        };

        if (values.isProd) {
            iOSCredsRequest.environment = 2; //TODO: verify why 2 on server side
        }

        const response = await ApplicationService.postCredentials(appData.id, iOSCredsRequest);
        if (response.data) {
            appData.credentials.push(response.data);
        }
    } else if (credentialsIOS.value) {
        const response = await ApplicationService.deleteCredentials(appData.id, credentialsIOS.value);
        if (response.data == 'OK') {
            toast.add({
                severity: 'info',
                summary: 'Success',
                detail: 'iOS credentials removed',
                life: 3000
            });
        }
    }

    if (isNew) {
        router.push({ name: 'application', params: { id: appData.id } });
    }

    setAppData(appData);
}

onMounted(async () => {
    if (!isNew) {
        var appResponse = await ApplicationService.getApplication(route.params.id);
        if (appResponse?.data) {
            setAppData(appResponse.data);
        }
    }
});

const [applicationName, applicationNameAttr] = defineField('applicationName');
const [apiKey, apiKeyAttr] = defineField('apiKey');
const [isIOS, isIOSAttr] = defineField('isIOS');
const [isAndroid, isAndroidAttr] = defineField('isAndroid');
const [description, descriptionAttr] = defineField('description');
const [isProd, isProdAttr] = defineField('isProd');
const [p12File] = defineField('p12File');
const [p12FileName] = defineField('p12FileName');
const [appBundleId, appBundleIdAttr] = defineField('appBundleId');
const [password, passwordAttr] = defineField('password');
const [serviceAccountFile] = defineField('serviceAccountFile');
const [serviceAccountFileName] = defineField('serviceAccountFileName');
</script>

<template>
    <Form @submit="submitForm">
        <div class="flex flex-col md:flex-row gap-8" v-if="true">
            <div class="md:w-1/2">
                <div class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl">
                        {{ isNew ? 'New Application' : 'Edit Application ' + $route.params.id }}
                    </div>
                    <div class="flex flex-col gap-2">
                        <label v-if="!isNew" for="applicationName">Application Name</label>
                        <InputText id="applicationName" type="text" v-model="applicationName" v-bind="applicationNameAttr" />
                        <Message severity="error" v-if="errors.applicationName">{{ errors.applicationName }}</Message>
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="description">Description</label>
                        <InputText id="description" type="text" v-model="description" v-bind="descriptionAttr" />
                        <Message severity="error" v-if="errors.description">{{ errors.description }}</Message>
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="apiKey">Api Key</label>
                        <InputText id="apiKey" type="text" :readonly="true" v-model="apiKey" v-bind="apiKeyAttr" />
                        <Message severity="error" v-if="errors.apiKey">{{ errors.apiKey }}</Message>
                    </div>
                    <h4>Credentials</h4>
                    <Divider />

                    <div class="flex flex-col gap-2">
                        <Fieldset legend="Android Platform" :toggleable="false">
                            <div class="flex flex-col gap-2">
                                <label for="android">Enabled?</label>
                                <ToggleSwitch inputId="android" v-model="isAndroid" v-bind="isAndroidAttr" />
                                <template v-if="isAndroid">
                                    <label for="serviceAccountFile">Service Account File</label>
                                    <FileUpload mode="basic" name="serviceAccountFile" :maxFileSize="MAX_FILE_SIZE" :customUpload="true" @select="onUploadServiceAccount" class="custom-file-upload" />
                                    <p v-if="serviceAccountFileName">Selected File: {{ serviceAccountFileName }}</p>
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
                                    <FileUpload mode="basic" name="p12file" :maxFileSize="MAX_FILE_SIZE" :customUpload="true" @select="onUploadp12" class="custom-file-upload" />
                                    <p v-if="p12FileName">Selected File: {{ p12FileName }}</p>
                                    <Message severity="error" v-if="errors.p12File">{{ errors.p12File }}</Message>
                                    <label for="password">Password</label>
                                    <InputText id="password" type="text" v-model="password" v-bind="passwordAttr" />
                                    <Message severity="error" v-if="errors.password">{{ errors.password }}</Message>
                                    <label for="password">App Bundle Id</label>
                                    <InputText id="appBundleId" type="text" v-model="appBundleId" v-bind="appBundleIdAttr" />
                                    <Message severity="error" v-if="errors.appBundleId">{{ errors.appBundleId }}</Message>
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
.custom-file-upload input[type='file'] {
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
