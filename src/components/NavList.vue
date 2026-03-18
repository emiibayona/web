<template>
  <ul v-show="!isMobile" :class="[headerClass, { 'py-0': atAdmin }, { 'py-5 nm:py-3': !atAdmin }]">
    <li @click="!atHome ? router.go(-1) : {}" class="font-extrabold cursor-pointer w-5 h-5"><img v-if="!atHome"
        class="rotate-90 hover:cursor-pointer hover:scale-110 hover:drop-shadow-lg w-5 h-5" src="/images/arrow.svg" />
    </li>

    <li v-for="(item, index) in data" :key="index" :id="`navLink-${index}`" class="h-[100px]">
      <NavLink :nav="item.path" :active="item.active" :item="item" class="px-1"
        :class="[{ 'w-[500px]': item.logo }, { 'w-min': !item.logo }, { 'max-w-[100px]': atAdmin }, { 'min-w-min max-w-[100px] nm:max-w-[200px]': !atAdmin }]">
        <img v-if="item.logo" class="w-auto object-contain justify-self-center"
          :class="[{ 'h-[50px]': atAdmin }, { 'nm:h-[100px]': !atAdmin }]" :src="item.logo" />
        <span v-else class="block justify-self-center">{{ item.name }}</span>
      </NavLink>
    </li>
  </ul>

  <div v-show="isMobile" class="w-full relative">
    <Compressor without-move bottom-arrow>
      <template #selected>
        <div class="w-full flex flex-row gap-4 items-center p-4" :class="[atHome ? 'h-[100px]' : 'h-min']">
          <a v-show="!atHome" href="/"><img src='/images/ico.png' class="h-20 w-auto " /></a>
          <span class="font-bold text-xl">Menú de navegación</span>
        </div>
      </template>
      <template #content>
        <div class="content grid grid-cols-4 justify-center items-center">
          <!-- <li > -->
          <NavLink v-for="(item, index) in data.filter(x => !x.home)" :key="index" :id="`navLink-${index}`"
            class="px-1 self-center justify-self-center" mobile :nav="item.path" :active="item.active" :item="item"
            :class="[
              { 'max-w-[100px]': atAdmin },
              { 'min-w-min max-w-[200px]': !atAdmin }
            ]">
            <img v-if="item.logo" class="w-auto object-contain justify-self-center"
              :class="[{ 'h-[100px]': atAdmin }, { 'nm:h-[200px]': !atAdmin }]" :src="item.logo" />
          </NavLink>
          <!-- </li> -->
        </div>
      </template>
    </Compressor>
  </div>
  <div class="absolute
  top-2 right-2
  nm:top-4 nm:right-4
  flex flex-row gap-4 cursor-pointer">
    <!-- <a v-if="data.find(x => x.active && x.value === 'magic')" class=""
    :href="`/user${data.find(x => x.active && x.path !== '/')?.path}`">Tus cartas</a> -->
    <Button v-if="isAdmin && !atAdmin" class="z-50" @click="router.push('/admin')">Admin
      panel</Button>
    <a class="icon-wrapper" href="/cart" :class="[{ 'active': route.path.includes('cart') }]">
      <span v-if="listsLength?.cart"></span>
      <img class="icon" src="/images/cart.png" alt="Logo" />
    </a>
    <a class="icon-wrapper" href="/wishlist" :class="[{ 'active': route.path.includes('wishlist') }]">
      <span v-if="listsLength?.wishlist"></span>
      <img class="icon" src="/images/wishlist.png" alt="Logo" />
    </a>
  </div>
</template>
<script setup>
import { computed, onMounted, ref, watch } from "vue";
import NavLink from "./NavLink.vue";
import { useRoute, useRouter } from "vue-router";
import { NAVIGATION } from "@/utils/constants";
import { GAMES } from '@/utils/constants';
import useCarts from '@/composables/useCart';
import Button from "./atomic/Button.vue";
import useDevices from "@/composables/useDevices";
import Compressor from "./atomic/Compressor.vue";

const { isMobile } = useDevices();
// const isMobile = computed(() => true)
const { allGamesCarts, allGamesWishlists } = useCarts(GAMES.MAGIC);
const listsLength = computed(() => ({
  cart: allGamesCarts.value.reduce((prev, cur) => prev += cur.count, 0), wishlist:
    allGamesWishlists.value.reduce((prev, cur) => prev += cur.count, 0)
}));

const route = useRoute();
const router = useRouter();
const atHome = computed(() => route.path === '/')
const atAdmin = computed(() => route.path.includes('admin'))
const isAdmin = computed(() => localStorage.getItem("admin-browser"))

const headerClass = "relative flex flex-row justify-center items-center px-10 z-20 bg-site whitespace-nowrap w-full overflow-auto nm:px-20 hd:gap-5 hd:overflow-none hd2:gap-24"

const data = computed(() =>
  Object.values(NAVIGATION).map(x => ({ ...x, active: x.home ? route.path === x.path : route.path.includes(x.path) })))

watch(data, () => {
  const index = data.value.findIndex(x => x.active);
  document.getElementById(`navLink-${index}`)?.scrollIntoView({
    block: 'center',
    inline: 'center'
  })
})
</script>
<style scoped lang="scss">
.header-mobile {
  height: 200px;
}

.icon-wrapper {
  position: relative;
  z-index: 100;
  cursor: pointer;

  .icon {
    @include breakpoint(nm) {
      width: 20px;
      height: 20px;
    }

    @include breakpoint(hd) {
      width: 30px;
      height: 30px;
    }
  }

  &.active {
    img {
      transform: scale(1.3);
    }
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
    z-index: 11;

    @include breakpoint(nm) {
      min-width: 8px;
      height: 8px;
      top: -2px;
      right: -4px;
      padding: 4px 4px;
    }

    @include breakpoint(hd) {
      min-width: 15px;
      height: 15px;
      top: -4px;
      padding: 2px 6px;
    }
  }

}
</style>
