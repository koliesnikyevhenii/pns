import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';

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
                    meta: { requiresAuth: true },
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/app/:id/message',
                    name: 'message',
                    meta: { requiresAuth: true },
                    component: () => import('@/views/pages/SendMessage.vue')
                },
                {
                    path: '/app/:id/messagebyalias',
                    name: 'messagebyalias',
                    meta: { requiresAuth: true },
                    component: () => import('@/views/pages/MessageAlias.vue')
                },
                {
                    path: '/app/:id/devices',
                    name: 'devices',
                    meta: { requiresAuth: true },
                    component: () => import('@/views/pages/Devices.vue')
                },
                {
                    path: '/app/:id/actions',
                    name: 'actions',
                    meta: { requiresAuth: true },
                    component: () => import('@/views/pages/Actions.vue')
                },
                {
                    path: '/app/:id/reports',
                    name: 'reports',
                    meta: { requiresAuth: true },
                    component: () => import('@/views/pages/Reports.vue')
                },
                {
                    path: '/app/:id/',
                    name: 'application',
                    meta: { requiresAuth: true },
                    component: () => import('@/views/pages/ApplicationForm.vue')
                },
                {
                    path: '/newapp/',
                    name: 'newapp',
                    meta: { requiresAuth: true },
                    component: () => import('@/views/pages/ApplicationForm.vue')
                }
            ]
        },
        {
            path: '/:pathMatch(.*)*', // Catch-all route for undefined paths
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },
        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        }
    ]
});

// Global navigation guard
router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
        // Redirect to login if not authenticated
        next('auth/login');
    } else {
        next(); // Continue to the route
    }
});

export default router;
