<script setup>
import { useLayout } from '@/layout/composables/layout';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from "vuex";
import { ApplicationService } from '@/service/ApplicationService';
import 'chartjs-adapter-date-fns';

const store = useStore();

const appList = ref([]);
const chartOptions = ref(null);
const chartData = ref([]);

const selectedApp = ref(null);
const deleteAppDialog = ref(false);

const router = useRouter();

function initCharts() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    chartOptions.value = {
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            x: {
                type: 'time',
                //TODO: adjust units to displayed date period
                // time: {
                //     unit: 'year'
                // },
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            }
        },
        animations: false
    };

    if (appList.value?.length) {
        chartData.value = appList.value.map(
            (app) => ({
                datasets: [
                    {
                        //TODO: limit displayed time period
                        data: app.messagesPerDay.map((item) => ({ x: item[0], y: item[1] }), []),
                        fill: false,
                        backgroundColor: documentStyle.getPropertyValue('--p-primary-500'),
                        borderColor: documentStyle.getPropertyValue('--p-primary-500'),
                        tension: 0,
                        borderWidth: 1,
                        pointRadius: 0.5,
                        pointHoverRadius: 4
                    }
                ]
            }),
            []
        );
    }
}

function editApp(appId, apiKey) {
    store.dispatch('setApiKey', apiKey)
    router.push({ name: 'application', params: { appId: appId } });
}

function deleteApplication(app) {
    selectedApp.value = app;
    deleteAppDialog.value = true;
}

function confirmDeleteApp(appId) {
    ApplicationService.deleteApp(appId).then((response) => {
        if (response?.data == 'OK') {
            appList.value = appList.value.filter((app) => app.id != appId);
            initCharts();
        }
    });

    deleteAppDialog.value = false;
}

function newApp() {
    router.push({ name: 'newapp' });
}

function appMessages(appId, apiKey) {
    store.dispatch('setApiKey', apiKey)
    router.push({ name: 'messagebyalias', params: { appId: appId } });
}

onMounted(async () => {
    const apps = await ApplicationService.getApplications();
    if (apps?.data) {
        appList.value = apps.data;
        initCharts();
    }
});
</script>

<template>
    <div class="grid grid-cols-12 gap-8">
        <div v-for="(app, index) in appList" :key="app.id" class="col-span-12 xl:col-span-6">
            <div class="card cursor-pointer" @click="appMessages(app.id, app.apiKey)">
                <Chart v-if="chartData[index]" type="line" :data="chartData[index]" :options="chartOptions" class="h-100" />
                <div v-else class="m-auto w-10" role="status">
                    <svg aria-hidden="true" class="w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none">
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                        />
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                        />
                    </svg>
                    <span class="sr-only">Loading</span>
                </div>
                <div class="font-semibold text-xl mt-4 mb-4">{{ app.name }}</div>
                <div class="mb-4">{{ app.description }}</div>
                <div class="mb-4">{{ app.apiKey }}</div>
                <Button icon="pi pi-file-edit" outlined rounded class="mr-2" @click="editApp(app.id, app.apiKey)" v-on:click.stop />
                <Button icon="pi pi-trash" outlined rounded severity="danger" @click="deleteApplication(app)" v-on:click.stop />
            </div>
        </div>

        <div class="col-span-12 xl:col-span-6 p-fluid">
            <Button icon="pi pi-plus" class="btn btn-primary" style="width: 100%" aria-label="Add" @click="newApp()" />
        </div>

        <Dialog v-model:visible="deleteAppDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="selectedApp"
                    >Are you sure you want to delete <b>{{ selectedApp.name }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteAppDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="confirmDeleteApp(selectedApp.id)" />
            </template>
        </Dialog>
    </div>
</template>

<style scoped>
.card {
    padding: 4rem;
}
</style>
