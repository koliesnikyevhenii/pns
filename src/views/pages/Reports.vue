<script setup>
import { ReportService } from '@/service/ReportService';
import { FilterMatchMode } from '@primevue/core/api';
import { onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';

const filters = ref(null);
const loading = ref(null);
const reportItems = ref(null);
const route = useRoute();

function getSeverity(status) {
    return 'info';
}

onBeforeMount(() => {
    ReportService.getMessageByTags(route.params.id).then((response) => {
        loading.value = false;
        reportItems.value = response.data.results;
    });

    initFilters();
});

function initFilters() {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
}
</script>

<template>
    <div class="card">
        <div class="font-semibold text-xl mb-4">Report Message by Tags</div>
        <DataTable
            stripedRows
            sortable
            :value="reportItems"
            :paginator="true"
            :rows="10"
            dataKey="id"
            :rowHover="true"
            v-model:filters="filters"
            :loading="loading"
            :filters="filters"
            :globalFilterFields="['Day', 'TagName', 'NumberOfMessageSent']"
            showGridlines
            :rowsPerPageOptions="[5, 10, 25]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
        >
            <template #header>
                <div class="flex justify-between">
                    <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                    </IconField>
                </div>
            </template>
            <template #empty> No device found. </template>
            <template #loading> Loading device data. Please wait. </template>
            <Column field="Day" header="Day" style="min-width: 12rem" :sortable="true">
                <template #body="{ data }">
                    {{ data.Day }}
                </template>
            </Column>
            <Column header="Tag Name" field="TagName" style="min-width: 12rem" :sortable="true">
                <template #body="{ data }">
                    <Tag :value="data.TagName" :severity="getSeverity()" />
                </template>
            </Column>
            <Column header="Number Of Message Sent" field="NumberOfMessageSent" style="min-width: 12rem" :sortable="true">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <span class="text-wrap text-break" style="word-break: break-all">{{ data.NumberOfMessageSent }}</span>
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>
