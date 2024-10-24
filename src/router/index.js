import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/app/:id/message',
                    name: 'message',
                    component: () => import('@/views/pages/SendMessage.vue')
                },
                {
                    path: '/app/:id/messagebyalias',
                    name: 'messagebyalias',
                    component: () => import('@/views/pages/MessageAlias.vue')
                },
                {
                    path: '/app/:id/devices',
                    name: 'devices',
                    component: () => import('@/views/pages/Devices.vue')
                },
                {
                    path: '/app/:id/actions',
                    name: 'actions',
                    component: () => import('@/views/pages/Actions.vue')
                },
                {
                    path: '/app/:id/reports',
                    name: 'reports',
                    component: () => import('@/views/pages/Reports.vue')
                },
                {
                    path: '/app/:id/',
                    name: 'application',
                    component: () => import('@/views/pages/ApplicationForm.vue')
                },
                {
                    path: '/newapp/',
                    name: 'newapp',
                    component: () => import('@/views/pages/ApplicationForm.vue')
                }
            ]
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },
        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        }
    ]
});

export default router;
