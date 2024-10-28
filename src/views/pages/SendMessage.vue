<template>
  <Fluid>
    <Form>
      <div class="flex mt-8">
        <div class="card flex flex-col gap-4 w-full">
          <div class="font-semibold text-xl">Send Message</div>
          <Fieldset legend="Message" :toggleable="false">
            <div class="flex flex-col md:flex-row gap-4">
              <div class="flex flex-wrap gap-2 w-full">
                <label for="firstname2">Header</label>
                <InputText id="header" type="text" />
              </div>
              <div class="flex flex-wrap gap-2 w-full">
                <label for="lastname2">Actions</label>
                <Select
                  id="action"
                  optionLabel="name"
                  placeholder="Select One"
                  class="w-full"
                ></Select>
              </div>
            </div>

            <div class="flex flex-wrap">
              <label for="payload">Payload:</label>
              <Textarea id="payload" rows="3" />
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
