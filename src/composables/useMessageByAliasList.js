import { ref, watch } from 'vue';
import { MessageService } from '@/service/MessageService';
import store from '@/store';

export function useMessageByAliasList(apiKey, deviceAlias, toast, router, route) {
    const loading = ref(false);
    const messageList = ref([]);
    console.log(deviceAlias);

    watch(
        apiKey,
        (newApiKey) => {
            if (!newApiKey) {
                store.dispatch('fetchApiKey', { appId: route.params.appId, toast: toast, router: router });
                return;
            }

            loading.value = true;
            MessageService.getMessagesByAlias(newApiKey, deviceAlias).then((response) => {
                if (response.code === 0) {
                    loading.value = false;
                    messageList.value = response.data;
                } else {
                    loading.value = false;
                    toast.add({
                        severity: 'error',
                        summary: 'Service error',
                        detail: response.errorMessage ?? 'Error during fetching the messages',
                        life: 5000
                    });
                    router.push({ name: 'dashboard' });
                }
            });
        },
        { immediate: true }
    );

    return { loading, messageList };
}