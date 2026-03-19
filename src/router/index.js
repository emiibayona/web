import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/pages/home/index.vue";
import { useAuth } from "@/composables/useAuth";

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
      meta: { requiresAuth: true, },
    },
    {
      path: "/wishlist",
      name: "Wishlist",
      component: () => import("@/pages/wishlist.vue"),
      meta: { requiresAuth: true, },
    },
    {
      path: "/admin",
      name: "admin",
      component: () => import("@/pages/admin/index.vue"),
      meta: { requiresAuth: true, role: "ADMIN" },
    },
    {
      path: "/admin/sellado",
      name: "admin sellado",
      component: () => import("@/pages/admin/sellado.vue"),
      meta: { requiresAuth: true, role: "ADMIN" },
    },
    {
      path: "/admin/magic/ventas",
      name: "Magic ventas",
      component: () => import("@/pages/admin/magic/ventas.vue"),
      meta: { requiresAuth: true, role: "ADMIN" },
    },
    {
      path: "/admin/magic/sellado",
      name: "Magic sellado",
      component: () => import("@/pages/admin/magic/sellado.vue"),
      meta: { requiresAuth: true, role: "ADMIN" },
    },
    {
      path: "/admin/magic/collection",
      name: "Magic collection",
      component: () => import("@/pages/admin/magic/collection.vue"),
      meta: { requiresAuth: true, role: "ADMIN" },
    },
    {
      path: "/admin/magic/binders",
      name: "Magic binders",
      component: () => import("@/pages/admin/magic/binders.vue"),
      meta: { requiresAuth: true, role: "ADMIN" },
    },
    {
      path: "/auth/login",
      name: "Login",
      component: () => import("@/pages/auth/index.vue"),
    },
    {
      path: "/auth/success",
      name: "Auth success",
      component: () => import("@/pages/auth/success.vue"),
    },
    {
      path: "/auth/info",
      name: "Auth info",
      component: () => import("@/pages/auth/login.vue"),
    },
    {
      path: "/user/magic/collection",
      name: "Magic Collection",
      component: () => import("@/pages/user/magic/collection.vue"),
      meta: { requiresAuth: true, role: "USER" },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("@/pages/NotFound.vue"),
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const { isAuthenticated, user, fetchUser, isAdmin } = useAuth();


  if (isAuthenticated.value && !user.value) {
    await fetchUser({ tenant: "geartown" });
  }

  if (to.meta.requiresAuth) {
    if (!isAuthenticated.value) {
      console.info("Login required");
      return next({ name: "Login", query: { redirect: window.location.origin + to.fullPath } });
    } else if (to.meta.role === "ADMIN" && !isAdmin.value) {
      console.info("Access role ADMIN required, not fullfiled, going home")
      return next({ name: "home" });
    }
  }

  next();
});

export default router;
