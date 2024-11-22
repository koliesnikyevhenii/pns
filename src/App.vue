<script setup>
import { onMounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
onMounted(() => {
    store.dispatch('initializeAuth');
})
</script>

<template>
    <router-view />
    <Toast/>
</template>

<style scoped></style>
