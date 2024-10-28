<script setup>
import { PayloadService } from "@/service/PayloadService";
import { onBeforeMount, ref, computed } from "vue";
import { useForm, Form } from "vee-validate";

const actionItems = ref(null);
const selectedAction = ref(null);
const action = computed(() => {
  return `{
    "action": "${selectedAction.value?.action ?? ""}"
}`;
});

onBeforeMount(() => {
  PayloadService.getActions().then((response) => {
    actionItems.value = response.data;
  });
});
</script>

<template>
  <Fluid>
    <Form>
      <div class="flex mt-8">
        <div class="card flex flex-col gap-4 w-full">
          <div class="font-semibold text-xl">Send Message</div>
          <Fieldset legend="Message" :toggleable="false">
            <div class="flex flex-col md:flex-row gap-4">
              <div class="flex flex-wrap gap-2 w-full">
                <label for="header">Header</label>
                <InputText id="header" type="text" />
              </div>
              <div class="flex flex-wrap gap-2 w-full">
                <label for="action">Actions</label>
                <Select
                  id="action"
                  optionLabel="action"
                  :options="actionItems"
                  v-model="selectedAction"
                  class="w-full"
                  placeholder="none"
                ></Select>
              </div>
            </div>

            <div class="flex flex-wrap">
              <label for="payload">Payload:</label>
              <Textarea id="payload" rows="3" v-model="action" />
            </div>

            <div class="flex flex-wrap">
              <label for="text">Text:</label>
              <Textarea id="text" rows="3" />
            </div>
          </Fieldset>
          <Fieldset legend="Schedule" :toggleable="false">
            <div class="flex flex-wrap">
              <label for="payload">Payload:</label>
              <InputText id="payload" />
            </div>
          </Fieldset>
          <Fieldset legend="Audience" :toggleable="false">
            <div class="flex flex-wrap">
              <label for="payload">Payload:</label>
              <InputText id="payload" />
            </div>
          </Fieldset>
          <Fieldset legend="Send by Api" :toggleable="false">
            <div class="flex flex-wrap">
              <label for="payload">Payload:</label>
              <InputText id="payload" />
            </div>
          </Fieldset>
        </div>
      </div>
    </Form>
  </Fluid>
</template>
