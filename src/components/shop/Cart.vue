<template>
    <div class="border-l-2 border-black cart">

        <h2 class="text-2xl font-semibold mb-4">Cart (<span>{{ totalCart }}</span>)</h2>

        <ul class="space-y-1">
            <MiniCartCard v-for="item in gameCart" :key="item.id" :item="item" />
        </ul>

        <div v-if="cart?.length" class="w-full flex mt-4">
            <button @click="console.log(items)"
                class="ml-auto px-4 py-2 rounded-md font-medium shadow-sm bg-gt-moustard-500 hover:bg-gt-moustard-600 active:bg-gt-moustard-700 text-gray-800 transition-all transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-gt-moustard-300">
                Confirmar compra
            </button>
        </div>

        <div v-if="gameCart?.length === 0" class="mt-6 text-center text-gray-500">
            Your cart is empty.
        </div>
    </div>
</template>

<script setup>
import useCarts from "@/composables/useCart";
import { GAMES, RECIPIENTS_LISTS } from "@/utils/constants";
import { computed, } from "vue";
import MiniCartCard from "./MiniCartCard.vue";

defineProps({
    edit: { type: Boolean, default: false }
})

const { cart, } = useCarts(GAMES.MAGIC, RECIPIENTS_LISTS.CART);

const gameCart = computed(() => cart.value[GAMES.MAGIC] || []);
const totalCart = computed(() => gameCart.value.reduce((prev, curr) => prev += curr.sets.reduce((prevSet, currSet) => prevSet += currSet.qty, 0), 0))
// const formatCurrency = (v) => {
//     if (!v) return null;
//     return new Intl.NumberFormat(undefined, {
//         style: "currency",
//         currency: "USD",
//     }).format(v);
// };
</script>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.cart {
    padding: 16px;

    @include breakpoint(nm) {
        padding: 8px;
    }
}
</style>
