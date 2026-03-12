import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/pages/home/index.vue";

const router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", name: "home", component: HomeView },
    {
      path: "/magic",
      name: "magic",
      component: () => import("@/pages/magic/index.vue"),
    },
    {
      path: "/yugioh",
      name: "yugioh",
      component: () => import("@/pages/yugioh/index.vue"),
    },
    {
      path: "/yugioh/sealed",
      name: "yugioh sellado",
      component: () => import("@/pages/yugioh/sealed/index.vue"),
    },
    {
      path: "/pokemon",
      name: "pokemon",
      component: () => import("@/pages/pokemon/index.vue"),
    },
    {
      path: "/pokemon/sealed",
      name: "pokemon sellado",
      component: () => import("@/pages/pokemon/sealed/index.vue"),
    },
    {
      path: "/riftbound",
      name: "riftbound",
      component: () => import("@/pages/riftbound/index.vue"),
    },
    {
      path: "/riftbound/sealed",
      name: "riftbound sellado",
      component: () => import("@/pages/riftbound/sealed/index.vue"),
    },
    {
      path: "/about",
      name: "about",
      component: () => import("@/pages/about/index.vue"),
    },
    {
      path: "/magic/singles",
      name: "magic-singles",
      component: () => import("@/pages/magic/singles/index.vue"),
    },
    {
      path: "/magic/sealed",
      name: "magic-sealed",
      component: () => import("@/pages/magic/sealed/index.vue"),
    },
    {
      path: "/cart",
      name: "Cart",
      component: () => import("@/pages/cart.vue"),
    },
    {
      path: "/wishlist",
      name: "Wishlist",
      component: () => import("@/pages/wishlist.vue"),
    },
    {
      path: "/admin",
      name: "admin",
      component: () => import("@/pages/admin/index.vue"),
    },
    {
      path: "/admin/sellado",
      name: "admin sellado",
      component: () => import("@/pages/admin/sellado.vue"),
    },
    {
      path: "/admin/magic/ventas",
      name: "Magic ventas",
      component: () => import("@/pages/admin/magic/ventas.vue"),
    },
    {
      path: "/admin/magic/sellado",
      name: "Magic sellado",
      component: () => import("@/pages/admin/magic/sellado.vue"),
    },
    {
      path: "/admin/magic/collection",
      name: "Magic collection",
      component: () => import("@/pages/admin/magic/collection.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("@/pages/NotFound.vue"),
    },
  ],
});

export default router;
