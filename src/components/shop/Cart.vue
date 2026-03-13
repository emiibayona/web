<template>
    <div class="nm:border-l-2 nm:border-black cart">

        <h2 class="text-2xl font-semibold mb-4">Cart (<span>{{ totalCart }}</span>)</h2>

        <ul class="space-y-1">
            <MiniCartCard v-for="item in gameCart" :key="item.id" :item="item" />
        </ul>

        <div v-if="gameCart?.length" class="w-full flex mt-4">
            <Button @click="$router.push('/cart')" size="xsmall">
                Ir a carrito
            </Button>
        </div>

        <div v-if="!gameCart?.length" class="mt-6 text-center text-gray-500">
            Carrito vacio.
        </div>
    </div>
</template>

<script setup>
import useCarts from "@/composables/useCart";
import { GAMES, RECIPIENTS_LISTS } from "@/utils/constants";
import { computed, } from "vue";
import MiniCartCard from "./MiniCartCard.vue";
import Button from "@/components/atomic/Button.vue";

defineProps({
    edit: { type: Boolean, default: false }
})

const { cart, } = useCarts(GAMES.MAGIC, RECIPIENTS_LISTS.CART);

const gameCart = computed(() => cart.value[GAMES.MAGIC] || []);
const totalCart = computed(() => gameCart.value.reduce((prev, curr) => prev += curr.sets.reduce((prevSet, currSet) => prevSet += currSet.qty, 0), 0))
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
