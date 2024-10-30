<script setup>
import { useLayout } from '@/layout/composables/layout';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import 'chartjs-adapter-date-fns';

import appList from '@/stubs/apps.json';

const { getPrimary, getSurface, isDarkTheme } = useLayout();

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
        }
    };

    //TODO: get appList from server & error handling
    if (appList.data) {
        chartData.value = appList.data.map(
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

function editApp(appId) {
    router.push({ name: 'application', params: { id: appId } });
}

function deleteApp(app) {
    selectedApp.value = app;
    deleteAppDialog.value = true;
}

function confirmDeleteApp(appId) {
    //TODO: call delete api
    console.log('delete app ', appId);
    deleteAppDialog.value = false;
}

function newApp() {
    router.push({ name: 'newapp' });
}

onMounted(() => {
    initCharts();
});

watch(
    [getPrimary, getSurface, isDarkTheme],
    () => {
        initCharts();
    },
    { immediate: true }
);
</script>

<template>
    <div class="grid grid-cols-12 gap-8">
        <div v-for="(app, index) in appList.data" :key="index" class="col-span-12 xl:col-span-6">
            <div class="card">
                <Chart type="line" :data="chartData[index]" :options="chartOptions" class="h-100" />
                <div class="font-semibold text-xl mt-4 mb-4">{{ app.name }}</div>
                <div class="mb-4">{{ app.description }}</div>
                <div class="mb-4">{{ app.apiKey }}</div>
                <Button icon="pi pi-file-edit" outlined rounded class="mr-2" @click="editApp(app.id)" />
                <Button icon="pi pi-trash" outlined rounded severity="danger" @click="deleteApp(app)" />
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
