<template>
  <ul>
    <li v-for="item in data" :key="item.name">
      <NavLink :nav="item.path" :active="item.active">{{ item.name }}</NavLink>
    </li>
  </ul>
</template>
<script setup>
import { computed } from "vue";
import NavLink from "./NavLink.vue";
import { useRoute } from "vue-router";
const route = useRoute();
const data = computed(() => [
  { name: "Magic: The Gathering", path: "magic", active: route.path.includes("magic") },
  { name: "Yu Gi Oh!", path: "yu-gi-oh" },
  { name: "Digimon", path: "digimon" },
  { name: "Sobre nosotros", path: "about" },
]);
</script>
