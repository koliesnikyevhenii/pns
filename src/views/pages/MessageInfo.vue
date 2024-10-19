<script setup>
import { reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import { ApplicationService } from "@/service/ApplicationService";

const application = reactive({});
const route = useRoute();

onMounted(() => {
  ApplicationService.getApplication(route.params.id).then((response) => {
    application.value = response;
    console.log(application);
  });
});
</script>

<template>
  <div class="font-semibold text-xl mb-12">Message Info {{ $route.params.id }}</div>
  <div class="flex flex-col md:flex-row gap-8">
    <div class="md:w-1/2">
      <div class="card flex flex-col gap-4">
        <div class="font-semibold text-xl">Edit Application</div>
        <div class="flex flex-col gap-2">
          <label for="name1">Application Name</label>
          <InputText
            id="applicationName"
            type="text"
            v-model="application.value.applicationName"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label for="email1">Description</label>
          <InputText
            id="description"
            type="text"
            v-model="application.value.description"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label for="age1">Api Key</label>
          <InputText id="apiKey" type="text" v-model="application.value.apiKey" />
        </div>
        <h4>Credentials</h4>
        <Divider />

        <Button label="Submit" :fluid="false"></Button>
      </div>
    </div>
  </div>
</template>
