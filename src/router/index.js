import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/pages/home/index.vue";
import { useAuth } from "@/composables/useAuth";
import { useToast } from "primevue/usetoast";

const router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", name: "home", component: HomeView },
    // MAGIC
    {
      path: "/magic",
      name: "Home Magic",
      component: () => import("@/pages/magic/index.vue"),
    },
    {
      path: "/magic/singles",
      name: "Magic Singles",
      component: () => import("@/pages/magic/singles/index.vue"),
    },
    {
      path: "/magic/sealed",
      name: "Magic Sealed",
      component: () => import("@/pages/magic/sealed/index.vue"),
    },
    // YUGIOH
    {
      path: "/yugioh",
      name: "Home Yugioh",
      component: () => import("@/pages/yugioh/index.vue"),
    },
    {
      path: "/yugioh/singles",
      name: "Yugioh Singles",
      component: () => import("@/pages/yugioh/singles/index.vue"),
    },
    {
      path: "/yugioh/sealed",
      name: "Yugioh Sealed",
      component: () => import("@/pages/yugioh/sealed/index.vue"),
    },
    // POKEMON
    {
      path: "/pokemon",
      name: "Home Pokemon",
      component: () => import("@/pages/pokemon/index.vue"),
    },
    {
      path: "/pokemon/sealed",
      name: "Pokemon Sealed",
      component: () => import("@/pages/pokemon/sealed/index.vue"),
    },
    // RIFTBOUND
    {
      path: "/riftbound",
      name: "Home Riftbound",
      component: () => import("@/pages/riftbound/index.vue"),
    },
    {
      path: "/riftbound/sealed",
      name: "Riftbound Sealed",
      component: () => import("@/pages/riftbound/sealed/index.vue"),
    },
    // GENERIC
    {
      path: "/about",
      name: "about",
      component: () => import("@/pages/about/index.vue"),
    },
    // USER
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
    // 
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
    // MAGIC ADMIN
    {
      path: "/admin/magic",
      name: "Magic admin",
      component: () => import("@/pages/admin/magic/index.vue"),
      meta: { requiresAuth: true, role: "ADMIN" },
    },
    {
      path: "/admin/magic/ventas",
      name: "Magic admin ventas",
      component: () => import("@/pages/admin/magic/ventas.vue"),
      meta: { requiresAuth: true, role: "ADMIN" },
    },
    {
      path: "/admin/magic/sellado",
      name: "Magic admin sellado",
      component: () => import("@/pages/admin/magic/sellado/index.vue"),
      meta: { requiresAuth: true, role: "ADMIN" },
    },
    {
      path: "/admin/magic/binders",
      name: "Magic admin binders",
      component: () => import("@/pages/admin/magic/binders.vue"),
      meta: { requiresAuth: true, role: "ADMIN" },
    },
    {
      path: "/admin/magic/collection",
      name: "Magic admin collection",
      component: () => import("@/pages/admin/magic/collection.vue"),
      meta: { requiresAuth: true, role: "ADMIN" },
    },
    // Yugioh ADMIN
    {
      path: "/admin/yugioh",
      name: "Yugioh admin",
      component: () => import("@/pages/admin/yugioh/index.vue"),
      meta: { requiresAuth: true, role: "ADMIN" },
    },
    {
      path: "/admin/yugioh/ventas",
      name: "Yugioh admin ventas",
      component: () => import("@/pages/admin/yugioh/ventas.vue"),
      meta: { requiresAuth: true, role: "ADMIN" },
    },
    {
      path: "/admin/yugioh/sellado",
      name: "Yugioh admin sellado",
      component: () => import("@/pages/admin/yugioh/sellado/index.vue"),
      meta: { requiresAuth: true, role: "ADMIN" },
    },
    // Pokemon ADMIN
    {
      path: "/admin/pokemon",
      name: "Pokemon admin",
      component: () => import("@/pages/admin/pokemon/index.vue"),
      meta: { requiresAuth: true, role: "ADMIN" },
    },
    {
      path: "/admin/pokemon/sellado",
      name: "Pokemon admin sellado",
      component: () => import("@/pages/admin/pokemon/sellado/index.vue"),
      meta: { requiresAuth: true, role: "ADMIN" },
    },
    // Riftbound ADMIN
    {
      path: "/admin/riftbound",
      name: "Riftbound admin",
      component: () => import("@/pages/admin/riftbound/index.vue"),
      meta: { requiresAuth: true, role: "ADMIN" },
    },
    {
      path: "/admin/riftbound/sellado",
      name: "Riftbound admin sellado",
      component: () => import("@/pages/admin/riftbound/sellado/index.vue"),
      meta: { requiresAuth: true, role: "ADMIN" },
    },
    // AUTH
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
    // USER PAGES
    {
      path: "/user/magic/collection",
      name: "Magic Collection",
      component: () => import("@/pages/user/magic/collection.vue"),
      meta: { requiresAuth: true, role: "USER" },
    },
    // NOT FOUND
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("@/pages/NotFound.vue"),
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const { isAuthenticated, user, fetchUser, isAdmin } = useAuth();
  const toast = useToast();

  if (isAuthenticated.value && !user.value) {
    await fetchUser({ tenant: "geartown" });
  }
  // const redirectQuery = { redirect: window.location.origin + from.fullPath }

  // // debugger;
  // if (to.name === 'Login') {
  //   to.query = { ...(to?.query || {}), ...redirectQuery }
  // }

  if (to.meta.requiresAuth) {
    if (!isAuthenticated.value) {
      console.info("Login required");

      return next({ name: "Login" });
    } else if (to.meta.role === "ADMIN" && !isAdmin.value) {
      toast.add({
        severity: "error",
        summary: "PERMISOS FALTANTES",
        detail: `Esta cuenta no cumple con los requisitos para acceder a esa pantalla`,
        life: 5000,
      });
      console.info("Access role ADMIN required, not fullfiled, going home")
      return next({ name: "home" });
    }
  }

  next();
});

export default router;
