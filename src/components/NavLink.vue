<template>
  <div class="group flex flex-col space-y-1 font-bold text-lg ">
    <a :href="href" class="py-1 block link">
      <slot></slot>
    </a>
    <span
      class="block bg-darkMoustard h-0.5 scale-0 origin-left transition-transform duration-500 ease-in-out group-hover:scale-100"
      :class="[{ 'scale-0': !active }, { 'scale-100': active }]"></span>
  </div>
</template>
<script setup>
import { ref } from "vue";
const props = defineProps({
  nav: {
    required: false,
    default: "",
  },
  active: {
    type: Boolean,
    default: false,
  },
});
const href = ref(`${window?.location?.origin}${props.nav}`);

</script>
<style scoped lang="scss">
.link {
  transition: all 0.3s ease-in-out;

  &:hover {
    text-shadow:
      4px 4px 4px rgba(0, 0, 0, 0.4),
      0 0 1em white,
      0 0 0.2em white;
  }
}

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
