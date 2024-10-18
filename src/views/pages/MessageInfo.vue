<template>
  <div class="font-semibold text-xl mb-12">Message Info {{ $route.params.id }}</div>
  <div class="flex flex-col md:flex-row gap-8">
    <div class="md:w-1/2">
      <div class="card flex flex-col gap-4">
        <div class="font-semibold text-xl">Vertical</div>
        <div class="flex flex-col gap-2">
          <label for="name1">Name</label>
          <InputText id="name1" type="text" />
        </div>
        <div class="flex flex-col gap-2">
          <label for="email1">Email</label>
          <InputText id="email1" type="text" />
        </div>
        <div class="flex flex-col gap-2">
          <label for="age1">Age</label>
          <InputText id="age1" type="text" />
        </div>
        <h4>Credentials</h4>
        <Divider />

        <Button label="Submit" :fluid="false"></Button>
      </div>
    </div>
  </div>
</template>
