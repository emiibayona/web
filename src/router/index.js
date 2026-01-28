import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/pages/home/index.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: "/", name: "home", component: HomeView },
        {
            path: '/magic',
            name: 'magic',
            component: () => import('@/pages/magic/index.vue'),
        }, {
            path: '/magic/singles',
            name: 'magic-singles',
            component: () => import('@/pages/magic/singles/index.vue'),
        }],
});

export default router;