<template>
    <div v-for="(cart, index) in values" :key="`${cart.name}-${index}`">
        <div v-if="cart.count" class="flex flex-col border-b-2 border-black px-10" :class="[{ 'pb-4': wishlist }]">
            <span class="font-bold mb-2 text-xl">{{ capi(cart.name) }} (<span class="font-normal">{{ cart.count
                    }}</span>)</span>
            <div class="flex flex-col gap-2 pl-2">
                <MiniCartCard v-for="(item, index_2) in cart.values" :key="`${cart.name}-${index}-${index_2}`"
                    :item="item" @add="add" @remove="remove" edit :from-wishlist="wishlist" />
            </div>
            <Button v-if="!wishlist" class="self-end my-5" size="small" @click="checkoutViaWhatsApp(cart)">{{
                `Comprar carrito de
                ${capi(cart.name)}`
            }}</Button>
        </div>

    </div>
</template>

<script setup>
import useCarts from '@/composables/useCart';
import MiniCartCard from './MiniCartCard.vue';
import { GAMES, RECIPIENTS_LISTS } from '@/utils/constants';
import { capitalizeFirstLetter } from '@/utils/utils';
import Button from '@/components/atomic/Button.vue';

defineProps({ values: { type: Array, default: () => [] }, wishlist: { type: Boolean, default: false } })
const { add, remove } = useCarts(GAMES.MAGIC, RECIPIENTS_LISTS.CART);
const capi = (str) => capitalizeFirstLetter(str);

const checkoutViaWhatsApp = (cart) => {
    const messageHeader = "Hola! Vengo desde el sitio web y me gustaría comprar estas cartas, :\n\n";
    const items = [];
    cart.values.forEach(item =>
        item.sets.forEach(itemSet => {
            items.push(`*${itemSet.qty}x* | ${item.name} | *SET:* ${itemSet.set.name} | *Tratamiento:* ${capi(itemSet.treatment === "" ? "normal" : itemSet.treatment)}`)
        })
    )
    window.open(`https://wa.me/${import.meta.env.VITE_PHONE_CONTACT}?text=${encodeURIComponent(messageHeader + items.join('\n'))}`, '_blank');
};
</script>

<style lang="scss" scoped></style>