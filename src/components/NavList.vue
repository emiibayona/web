<template>
  <ul class="relative">
    <li v-for="(item, index) in data" :key="index">
      <NavLink :nav="item.path" :active="item.active">{{ item.name }}</NavLink>
    </li>
    <div class="absolute top-4 right-4 flex flex-row gap-4 cursor-pointer">
      <!-- <a v-if="data.find(x => x.active && x.value === 'magic')" class=""
        :href="`/user${data.find(x => x.active && x.path !== '/')?.path}`">Tus cartas</a> -->
      <a class="icon-wrapper" href="/cart" :class="[{ 'active': listsLength.cart || route.path.includes('cart') }]">
        <!-- <span v-if="listsLength?.cart">{{ listsLength.cart }}</span> -->
        <img class="icon" src="/images/cart.png" alt="Logo" />
      </a>
      <a class="icon-wrapper" href="/wishlist"
        :class="[{ 'active': listsLength.wishlist || route.path.includes('wishlist') }]">
        <!-- <span v-if="listsLength?.wishlist">{{ listsLength.wishlist }}</span> -->
        <img class="icon" src="/images/wishlist.png" alt="Logo" />
      </a>
    </div>
  </ul>
</template>
<script setup>
import { computed, ref } from "vue";
import NavLink from "./NavLink.vue";
import { useRoute } from "vue-router";
import { NAVIGATION } from "@/utils/constants";
import { GAMES } from '@/utils/constants';
import useCarts from '@/composables/useCart';

// const listsLength = ref({});

const { allGamesCarts, allGamesWishlists } = useCarts(GAMES.MAGIC);
const listsLength = computed(() => ({
  cart: allGamesCarts.value.reduce((prev, cur) => prev += cur.count, 0), wishlist:
    allGamesWishlists.value.reduce((prev, cur) => prev += cur.count, 0)
}));

const route = useRoute();

const data = computed(() =>
  Object.values(NAVIGATION).map(x => ({ ...x, active: x.home ? route.path === x.path : route.path.includes(x.path) })))

</script>
<style scoped lang="scss">
.icon-wrapper {
  position: relative;
  z-index: 100;
  cursor: pointer;

  .icon {
    width: 30px;
    height: 30px;
  }

  &.active {
    transform: scale(1.3);
  }

  &:hover:not(.active) {
    transform: scale(1.2);
    transition: all 0.5s ease-in-out;
    animation-fill-mode: both;
  }

  &:active {
    transform: scale(0.9);
    transition: all 0.1s ease-in-out;
  }


  span {
    position: absolute;
    top: -8px;
    right: -8px;
    background-color: red;
    color: white;
    border-radius: 50%;
    padding: 2px 6px;
    font-size: 12px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 20px;
    height: 20px;
    z-index: 11;
  }

}
</style>
