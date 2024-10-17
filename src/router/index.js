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
                    path: '/message',
                    name: 'message',
                    component: () => import('@/views/pages/SendMessage.vue')
                },
                {
                    path: '/messagebyalias',
                    name: 'messagebyalias',
                    component: () => import('@/views/pages/MessageAlias.vue')
                },
                {
                    path: '/devices',
                    name: 'devices',
                    component: () => import('@/views/pages/Devices.vue')
                },
                {
                    path: '/actions',
                    name: 'actions',
                    component: () => import('@/views/pages/Actions.vue')
                },
                {
                    path: '/reports',
                    name: 'reports',
                    component: () => import('@/views/pages/Reports.vue')
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
