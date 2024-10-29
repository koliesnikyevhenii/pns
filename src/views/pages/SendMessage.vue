<script setup>
import { PayloadService } from "@/service/PayloadService";
import { onBeforeMount, ref, computed } from "vue";
import { Form } from "vee-validate";

const actionItems = ref(null);
const selectedAction = ref(null);
const scheduleRadio = ref("1");
const sendMode = ref("1");
const tags = ref(null);

const action = computed(() => {
  return `{
    "action": "${selectedAction.value?.action ?? ""}"
}`;
});

onBeforeMount(() => {
  PayloadService.getActions().then((response) => {
    actionItems.value = response.data;
    //tags.value = [response.data, []];
  });

  PayloadService.getTags().then((response) => {
    tags.value = [response.data.map((item) => ({ name: item })), []];
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
              <div class="flex items-center">
                <RadioButton
                  v-model="scheduleRadio"
                  inputId="scheduleRadio1"
                  name="scheduleRadio"
                  value="1"
                />
                <label for="scheduleRadio1" class="ml-1 pe-5"
                  >Begin send immediately</label
                >
              </div>
              <div class="flex items-center">
                <RadioButton
                  v-model="scheduleRadio"
                  inputId="scheduleRadio2"
                  name="scheduleRadio"
                  value="2"
                />
                <label for="scheduleRadio2" class="ml-1 pe-5"
                  >Begin send at a particular time</label
                >
              </div>
            </div>
          </Fieldset>
          <Fieldset legend="Audience" :toggleable="false">
            <div class="flex flex-wrap">
              <div class="flex items-center">
                <RadioButton
                  v-model="sendMode"
                  inputId="sendMode1"
                  name="sendMode"
                  value="1"
                />
                <label for="scheduleRadio1" class="ml-1 pe-5">Send to Everyone</label>
              </div>
              <div class="flex items-center">
                <RadioButton
                  v-model="sendMode"
                  inputId="sendMode2"
                  name="sendMode"
                  value="2"
                />
                <label for="scheduleRadio2" class="ml-1 pe-5">Send by Tag(s)</label>
              </div>
              <div class="flex items-center">
                <RadioButton
                  v-model="sendMode"
                  inputId="sendMode3"
                  name="sendMode"
                  value="3"
                />
                <label for="scheduleRadio2" class="ml-1 pe-5">Send to Alias(es)</label>
              </div>
            </div>
          </Fieldset>
          <Fieldset legend="Send by Api" :toggleable="false" v-if="sendMode != 1">
            <div class="flex flex-wrap" v-if="sendMode == 2">
              <label for="payload">Payload:</label>
              <InputText id="payload" />
            </div>
            <div class="flex flex-wrap" v-else>
              <PickList v-model="tags" breakpoint="1400px" dataKey="id">
                <template #option="{ option }">
                  {{ option.name }}
                </template>
              </PickList>
            </div>
          </Fieldset>
          <div class="mb-4">
            <Button label="Submit" type="submit" :fluid="false"></Button>
          </div>
        </div>
      </div>
    </Form>
  </Fluid>
</template>
