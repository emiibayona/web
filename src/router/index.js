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
      path: "/pokemon",
      name: "pokemon",
      component: () => import("@/pages/pokemon/index.vue"),
    },
    {
      path: "/digimon",
      name: "digimon",
      component: () => import("@/pages/digimon/index.vue"),
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
      path: "/user/magic",
      name: "user Collection",
      component: () => import("@/pages/user/magic/index.vue"),
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
      path: "/magic/admin/ventas",
      name: "Ventas magic",
      component: () => import("@/pages/magic/admin/ventas.vue"),
    },
    {
      path: "/magic/admin/",
      name: "ADmin magic",
      component: () => import("@/pages/magic/admin/index.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("@/pages/NotFound.vue"),
    },
  ],
});

export default router;
