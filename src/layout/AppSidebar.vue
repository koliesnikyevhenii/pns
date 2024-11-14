<script setup>
import AppMenu from './AppMenu.vue';
import { computed } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const showMenu = computed(() => route.name !== 'dashboard');
</script>

<template>
    <div class="layout-sidebar">
        <app-menu v-if="showMenu"></app-menu>
    </div>
</template>

<style lang="scss" scoped></style>
