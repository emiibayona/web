<template>
  <div class="group flex flex-col space-y-2 font-bold">
    <a :href="href" class="py-2 block">
      <slot></slot>
    </a>
    <span
      class="block bg-darkMoustard h-0.5 scale-0 origin-left transition-transform duration-500 ease-in-out group-hover:scale-100"
    ></span>
  </div>
</template>
<script setup>
import { ref } from "vue";
const props = defineProps({
  href: {
    required: false,
    default: "",
  },
});
const href = ref(props.href);
</script>
<style scoped>
h1 {
  color: #666;
  display: inline-block;
  margin: 0;
  text-transform: uppercase;
}
h1:after {
  display: block;
  content: "";
  border-bottom: solid 3px #019fb6;
  transform: scaleX(0);
  transition: transform 250ms ease-in-out;
}
h1:hover:after {
  transform: scaleX(1);
}
</style>
