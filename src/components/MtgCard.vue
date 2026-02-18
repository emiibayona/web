<template>
    <div class="flip-container" :class="[{ 'hasDouble': card.image.hasDouble }]">
        <div class="card relative" :class="[{ 'in-shop': shop }]">
            <div class="quantity">
                {{ card.quantity }}
            </div>
            <div v-if="card.treatment === 'foil'" class="absolute top-0 left-0 w-full h-full rainbow-bg z-10">
            </div>
            <img :src="card.image.faceUp" class="front" />
            <img :src="card.image.faceDown" class="back" />
        </div>
        <!-- class="absolute bottom-0 left-[100px] w-full h-[200px] bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center gap-2 cursor-pointer" -->
        <div v-if="shop" class="shop">
            <div class="flex flex-row gap-1">
                <span
                    class="text-white font-bold drop-shadow-md hover:cursor-pointer hover:scale-125 duration-300 hover:z-20 hover:bg-black hover:rounded-sm hover:px-2"
                    @click="addCard">+1
                    Carrito</span>
                <span class="text-white font-bold drop-shadow-md">|</span>
                <span
                    class="text-white font-bold drop-shadow-md hover:cursor-pointer hover:scale-125 duration-300 hover:z-20 hover:bg-black hover:rounded-sm hover:px-2"
                    @click="addWishlist">+1
                    Wishlist</span>
            </div>
            <a :href="ckUrl" target="_blank" class="text-sm text-gray-300 underline hover:scale-110 duration-300">Ver
                versiones en CardKingdom</a>
            <span v-if="!price" class="text-white font-bold hover:scale-125 duration-300" @click="checkPrice">Check
                price</span>
            <div v-else class="flex flex-col justify-center items-center gap-2">
                <span class="text-white font-bold">{{ price }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { computed, ref } from 'vue';

const props = defineProps({
    card: { type: Object, default: () => ({}) },
    shop: { type: Boolean, default: false },
})

const emits = defineEmits(["add-to-cart"]);
const price = ref(null);
const cardName = computed(() => props.card.name.toLowerCase().split("//")[0].trim().replaceAll(",", ""))
const ckUrl = computed(() => {
    return `https://www.cardkingdom.com/catalog/view?filter[search]=mtg_advanced&filter[name]=${cardName.value}${props?.card?.treatment === 'foil' ? '&filter[tab]=mtg_foil' : ''}`
})

const checkPrice = async () => {
    const response = await axios.get(`https://json.edhrec.com/cards/${cardName.value.replace(/\s+/g, '-')}`);
    price.value = response.data.prices.cardkingdom.price;
}
const addCard = () => {
    emits("add-to-cart", { item: props.card });
}
const addWishlist = () => {
    emits("add-to-wishlist", { item: props.card });
}
</script>

<style lang="scss" scoped>
.flip-container {
    background-color: transparent;
    border: 1px solid #ccc;
    perspective: 1000px;
    width: 230px;
    height: 320px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;

    @include breakpoint(nm) {
        width: 230px;
        height: 320px;
    }

}

.shop {
    bottom: 0px;
    position: absolute;
    width: 100%;
    height: 100px;
    background-color: rgba(0, 0, 0, 0.4);
    opacity: 0;
    transition: all 0.7s;
    animation-fill-mode: forwards;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2px;
    border-radius: 6px;
    cursor: pointer;
    z-index: 20;
}

.card {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: all 0.7s;
    transform-style: preserve-3d;

    perspective: 1000px;

    .quantity {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 4px;
        height: 24px;
        width: 30px;
        background-color: rgb(211, 211, 211, 0.5);
        top: 40px;
        right: 30px;
        z-index: 20;
        cursor: default;
        transition: opacity 0.7s;
        transform-style: preserve-3d;
        font-weight: bold;
        perspective: 1000px;
    }
}

.flip-container {
    &.hasDouble:hover {
        .card {
            &.in-shop {
                transform: rotateY(180deg) translateY(-50px);
            }

            &:not(.in-shop) {
                transform: rotateY(180deg);

            }

            .quantity {
                transform: rotateY(-180deg);
                left: 30px;
                // opacity: 1;
            }
        }
    }

    &:not(.hasDouble):hover {
        .card {
            &.in-shop {
                transform: rotateY(0) translateY(-50px);
            }

            &:not(.in-shop) {
                transform: rotateY(0);
            }
        }
    }

    &:hover {
        .card {
            box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.5);
            border-radius: 10px;
        }

        .shop {
            opacity: 1;
            bottom: -30px;
        }
    }
}

.front,
.back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 5rem;
}

.back {
    transform: rotateY(180deg);
}
</style>