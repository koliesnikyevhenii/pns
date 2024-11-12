<script setup>
import { onBeforeMount, ref, reactive, watch } from "vue";
import { useForm, Form } from "vee-validate";
import * as yup from "yup";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
import { SendMode, ScheduleMode } from "@/constants/enums"; 
import { ActionService } from "@/service/ActionService";
import { TagService } from "@/service/TagsService";
import AutoComplete from 'primevue/autocomplete';
import { MessageService } from "@/service/MessageService";

const router = useRouter();
const toast = useToast();

const actionItems = ref([]);
const selectedAction = ref('');
const tags = ref([]);
const filteredTags = ref([]);

const message = reactive({
  messageHeader: '',
  messagePayload: `{
    "action": ""
}`,
  messageText: '',
  messageSendDate: null,
  scheduleMode: ScheduleMode.IMMEDIATELY,
  sendMode: SendMode.EVERYONE,
  messageAliases: '',
  messageTags: []
})

const schema = yup.object({
  messageText: yup.string().required("'Text' required"),
  messageAliases: yup.string().when('sendMode', {
    is: SendMode.ALIAS,
    then: (f) => f. required("'Aliase' required"),
    otherwise: (f) => f.notRequired()
  }),
  messageTags: yup.array().when('sendMode', {
    is: SendMode.Tag,
    then: (f) => f.required("'Tag' required"),
    otherwise: (f) => f.notRequired()
  }),
  messageSendDate: yup.date().when('scheduleMode', {
    is: ScheduleMode.SCHEDULED,
    then: (f) => f.required("'Date' required"),
    otherwise: (f) => f.notRequired()
  }),
});

const { defineField, handleSubmit, errors, setFieldValue } = useForm({
  initialValues: message,
  validationSchema: schema,
});

const [messageHeader, messageHeaderAttr] = defineField("messageHeader");
const [messagePayload, messagePayloadAttr] = defineField("messagePayload");
const [messageSendDate, messageSendDateAttr] = defineField("messageSendDate");
const [messageText, messageTextAttr] = defineField("messageText");
const [scheduleMode, scheduleModeAttr] = defineField("scheduleMode");
const [sendMode, sendModeAttr] = defineField("sendMode");
const [messageAliases, messageAliasesAttr] = defineField("messageAliases");
const [messageTags, messageTagsAttr] = defineField("messageTags");

const searchTags = (event) => {
  setTimeout(() => {
    if (!event.query.trim().length) {
      filteredTags.value = [...tags.value];
    } else {
      filteredTags.value = tags.value.filter((tag) => {
        return tag.toLowerCase().startsWith(event.query.toLowerCase());
      });
    }
  }, 250);
};

const selectTag = (tag) => {
  setFieldValue("messageTags", [...messageTags.value, tag])
  tags.value = tags.value.filter((item) => item !== tag);
};

const selectTagFromDropdown = (event) => {
  event.originalEvent.preventDefault();
  tags.value = tags.value.filter((item) => item !== event.value);
};

const unselectTag = (event) => {
  tags.value.push(event.value);
};

const submitForm = handleSubmit((values) => {
  MessageService.SendMessage(values).then(() => {
    toast.add({
      severity: "info",
      summary: "Success",
      detail: "Message sent successfuly",
      life: 3000,
    });
  })
});

watch(selectedAction, (newAction) => {
  const parsedJson = JSON.parse(messagePayload.value);
  parsedJson.action = newAction.action;
  const data = JSON.stringify(parsedJson, null, 4);
  setFieldValue("messagePayload", data);
})

onBeforeMount(() => {
  if (router.options?.history?.state?.alias) {
    sendMode.value = SendMode.ALIAS;
    setFieldValue("messageAliases", router.options.history.state.alias)
  }

  ActionService.getActions().then((response) => {
    actionItems.value = response.data;
  });

  TagService.getTags().then((response) => {
    tags.value = response.data;
  })
});
</script>

<template>
  <Fluid>
    <Form @submit="submitForm">
      <div class="flex mt-8">
        <div class="card flex flex-col gap-4 w-full">
          <div class="font-semibold text-xl">Send Message</div>
          <Fieldset legend="Message" :toggleable="false">
            <div class="flex flex-col md:flex-row gap-4">
              <div class="flex flex-wrap gap-2 w-full">
                <label for="messageHeader">Header</label>
                <InputText id="messageHeader" type="text" v-model="messageHeader" v-bind="messageHeaderAttr"/>
                <Message severity="error" v-if="errors.messageHeader">{{ errors.messageHeader }}</Message>
              </div>
              <div class="flex flex-wrap gap-2 w-full">
                <label for="selectedAction">Actions</label>
                <Select
                  id="selectedAction"
                  optionLabel="action"
                  :options="actionItems"
                  v-model="selectedAction"
                  class="w-full"
                  placeholder="none"
                ></Select>
              </div>
            </div>

            <div class="flex flex-wrap">
              <label for="messagePayload">Payload:</label>
              <Textarea id="messagePayload" rows="3" v-model="messagePayload" v-bind="messagePayloadAttr" />
              <Message severity="error" v-if="errors.messagePayload">{{ errors.messagePayload }}</Message>
            </div>

            <div class="flex flex-wrap">
              <label for="messageText">Text:</label>
              <Textarea id="messageText" rows="3" v-model="messageText" v-bind="messageTextAttr" />
              <Message severity="error" v-if="errors.messageText" class="mt-2">{{ errors.messageText }}</Message>
            </div>
          </Fieldset>
          <Fieldset legend="Schedule" :toggleable="false">
            <div class="flex flex-wrap">
              <div class="flex items-center">
                <RadioButton
                  v-model="scheduleMode"
                  v-bind="scheduleModeAttr"
                  :inputId="`scheduleMode${ScheduleMode.IMMEDIATELY}`"
                  name="scheduleMode"
                  :value="ScheduleMode.IMMEDIATELY"
                />
                <label :for="`scheduleMode${ScheduleMode.IMMEDIATELY}`" class="ml-1 pe-5"
                  >Begin send immediately</label
                >
              </div>
              <div class="flex items-center">
                <RadioButton
                  v-model="scheduleMode"
                  v-bind="scheduleModeAttr"
                  :inputId="`scheduleMode${ScheduleMode.SCHEDULED}`"
                  name="scheduleMode"
                  :value="ScheduleMode.SCHEDULED"
                />
                <label :for="`scheduleMode${ScheduleMode.SCHEDULED}`" class="ml-1 pe-5"
                  >Begin send at a particular time</label
                >
              </div>
            </div>
            <div class="flex flex-wrap mt-3" v-if="scheduleMode == ScheduleMode.SCHEDULED">
              <div class="flex flex-col">
                <DatePicker 
                  id="datepicker-12h" 
                  v-model="messageSendDate"
                  v-bind="messageSendDateAttr"
                  dateFormat="yy-mm-dd"
                  showTime 
                  hourFormat="12" 
                  fluid 
                  showIcon
                  iconDisplay="input" />
                  <Message severity="error" v-if="errors.messageSendDate" class="mt-2 w-auto">{{ errors.messageSendDate }}</Message>
                </div>
            </div>
          </Fieldset>
          <Fieldset legend="Audience" :toggleable="false">
            <div class="flex flex-wrap">
              <div class="flex items-center">
                <RadioButton
                  v-model="sendMode"
                  v-bind="sendModeAttr"
                  :inputId="`sendMode${SendMode.EVERYONE}`"
                  name="sendMode"
                  :value="SendMode.EVERYONE"
                />
                <label :for="`sendMode${SendMode.EVERYONE}`" class="ml-1 pe-5">Send to Everyone</label>
              </div>
              <div class="flex items-center">
                <RadioButton
                  v-model="sendMode"
                  v-bind="sendModeAttr"
                  :inputId="`sendMode${SendMode.TAG}`"
                  name="sendMode"
                  :value="SendMode.TAG"
                />
                <label :for="`sendMode${SendMode.TAG}`" class="ml-1 pe-5">Send by Tag(s)</label>
              </div>
              <div class="flex items-center">
                <RadioButton
                  v-model="sendMode"
                  v-bind="sendModeAttr"
                  :inputId="`sendMode${SendMode.ALIAS}`"
                  name="sendMode"
                  :value="SendMode.ALIAS"
                />
                <label :for="`sendMode${SendMode.ALIAS}`" class="ml-1 pe-5">Send to Alias(es)</label>
              </div>
            </div>
          </Fieldset>
          <Fieldset legend="Send by Api" :toggleable="false" v-if="sendMode != SendMode.EVERYONE">
            <div class="flex flex-wrap" v-if="sendMode == SendMode.ALIAS">
              <label for="messageAliases" class="mb-3">Alias(es):</label>
              <InputText id="messageAliases" v-model="messageAliases" v-bind="messageAliasesAttr"/>
              <Message severity="error" v-if="errors.messageAliases" class="mt-2">{{ errors.messageAliases }}</Message>
            </div>
            <div class="flex flex-col space-y-2" v-else-if="sendMode == SendMode.TAG">
              <div class="tags-container w-full">
                <label for="messageTags" class="mb-3">Tag(s):</label>
                <AutoComplete
                  id="messageTags"
                  v-model="messageTags"
                  v-bind="messageTagsAttr"
                  :suggestions="filteredTags"
                  @complete="searchTags"
                  placeholder="Add a tag"
                  multiple
                  fluid
                  @option-select="selectTagFromDropdown"
                  @option-unselect="unselectTag"
                  @keydown.enter.prevent
                  class="w-full"
                >
                </AutoComplete>
                <Message severity="error" v-if="errors.messageTags" class="mt-2">{{ errors.messageTags }}</Message>
              </div>
              <div class="tags-list flex flex-wrap gap-2 mt-2">
                <div
                  v-for="tag in tags"
                  :key="tag"
                  class="inline-flex items-center">
                    <Tag class="my-1 cursor-pointer" :value="tag" severity="info" @click="selectTag(tag)"/>
                </div>
              </div>
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
