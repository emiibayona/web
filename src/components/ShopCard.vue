<template>
    <div class="flip-container" :class="[{ 'hasDouble': card.image.hasDouble && !flipDisable }]"
        :id="`card-${card?.id}`" @click="hightlightComponent()">
        <div class="card relative" :class="[{ 'in-shop': shop }]">
            <div v-if="card?.quantity" class="quantity" :class="{ 'edit': !updating && (!shop && editQty) }"
                @click="showEdit">
                <Loader v-if="updating" class="w-1/2 h-1/2" />
                <span v-show="!updating && (shop || !editQty)">{{ card.quantity }}</span>
                <InputField v-show="!updating && (!shop && editQty)" v-model="qty" placeholder="" @input="updateCard"
                    only-enter :debounce="0" :min="0" type="number" :id="`input-${card.cardId}`" ref="inputFieldRef"
                    class="py-0 rounded-[4px]" @keyup.esc="showEdit(false)" />
            </div>
            <div v-if="card.treatment === 'foil'" class="absolute top-0 left-0 w-full h-full rainbow-bg z-10">
            </div>
            <img :src="card?.image?.faceUp" class="front" />
            <img :src="card?.image?.faceDown" class="back" />
        </div>
        <div v-if="shop" class="shop">
            <div v-if="card.quantity" class="quantity_tag hi-res px-2">
                <span>
                    Disponibles:
                    {{ card.quantity }}
                </span>
            </div>
            <div v-if="!loading" class="flex flex-row gap-1">
                <span class="border-r-2 border-white pr-1" :class="[cartWish, !isMobile && hoverClass]"
                    @click.stop="addCard">+1
                    Carrito</span>
                <!-- <span class="text-white font-bold drop-shadow-md">|</span> -->
                <span :class="[cartWish, !isMobile && hoverClass]" @click.stop="addWishlist">+1
                    Wishlist</span>
            </div>
            <div v-else>
                <Loader />
            </div>
            <a v-if="game === GAMES.MAGIC" :href="ckUrl" target="_blank"
                class="text-sm text-gray-300 underline hover:scale-110 duration-300">Ver
                versiones en CardKingdom</a>
            <span v-if="!price" class="text-white font-bold hover:scale-125 duration-300" @click="checkPrice">Ver precio
                aprox</span>
            <div v-else class="flex flex-col justify-center items-center gap-2 mt-1">
                <span class="text-white font-bold">{{ price }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import InputField from '@/components/atomic/InputField.vue';
import Loader from '@/components/atomic/Loader.vue';
import { useAuth } from '@/composables/useAuth';
import useDevices from '@/composables/useDevices';
import { GAMES } from '@/utils/constants';
import useBeauty from '@/composables/useBeauty';


const props = defineProps({
    card: { type: Object, default: () => ({}) },
    shop: { type: Boolean, default: false },
    flipDisable: { type: Boolean, default: false },
    updating: { type: Boolean, default: false },
    id: { type: [String, Number], default: () => null },
    game: { type: String, default: GAMES.MAGIC },
    zoomeable: { type: Boolean, default: false },
})

const cartWish = 'text-white font-bold drop-shadow-md duration-300 text-white font-bold drop-shadow-md duration-300';
const hoverClass = 'hover:cursor-pointer hover:scale-125 hover:z-20 hover:bg-black hover:rounded-sm hover:px-2 hover:border-none';

const emits = defineEmits(["add-to-cart", "add-to-wishlist", 'update']);
const price = ref(null);
const qty = ref(null);
const editQty = ref(false);
const inputFieldRef = ref(null);
const { loading } = useAuth();
const { isMobile, width } = useDevices();

const isZoomeable = computed(() => props.zoomeable && width.value >= 1280);
const { hightlightComponent } = useBeauty(`card-${props?.card?.id}`, isZoomeable.value, { width: '400px' })

let touchTimeout;

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
const showEdit = (val = true) => {
    if (props.shop) return;
    editQty.value = val;
}
const updateCard = () => {
    if (qty.value === props.card.quantity) {
        editQty.value = false;
    } else {
        emits("update", { ...props.card, amount: qty.value })
    }
}
watch(editQty, async () => {
    await nextTick();

    if (inputFieldRef.value?.inputElement) {
        inputFieldRef.value.inputElement.focus();
    }
})
const lowKey = ({ key }) => {
    if (key === "Escape") {
        updateCard();
    }
}

onMounted(() => {
    qty.value = props.card.quantity;
    if (props.edit) {
        document.addEventListener('keydown', lowKey);
    }

    const card = document.getElementById(`card-${props.id}`);
    if (isMobile.value) {

        card.addEventListener('touchstart', () => {
            touchTimeout = setTimeout(() => {
                card.classList.add('active');
            }, 100);
        }, { passive: true });

        card.addEventListener('touchmove', () => {
            clearTimeout(touchTimeout);
            card.classList.remove('active');
        });

        card.addEventListener('touchend', () => {
            clearTimeout(touchTimeout);
            card.classList.remove('active');
        });
    }

    if (props?.card?.card_prices?.length) {
        price.value = `TCG: $${props?.card?.card_prices[0]?.tcgplayer_price}`;
    }
})
onUnmounted(() => { if (props.edit) { document.removeEventListener('keydown', lowKey) } })
</script>

<style lang="scss" scoped>
.quantity_tag {
    border-radius: 4px;
    height: 24px;
    min-width: 30px;
    max-width: fit-content;
    font-weight: bold;
    background-color: rgb(211, 211, 211, 0.7);
    @include flex(row, center, center);

    &.hi-res {
        @include breakpoint(hd) {
            display: none;
        }
    }
}

.flip-container {
    background-color: transparent;
    perspective: 1000px;
    position: relative;
    @include flex(column, flex-start, center);

    @include breakpoint(nm) {
        width: 90%;
        @include flex(row, flex-start, flex-start);
        gap: 10px;
        max-height: calc(100vh / 3);
    }

    @include breakpoint(hd) {
        aspect-ratio: 23 / 32;
        width: 230px;
        object-fit: cover;
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

    @include breakpoint(nm) {
        position: unset;
        height: 100%;
        opacity: 100;
        gap: 6px;
    }

    text-align: center;
}

.card {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: all 0.7s;
    transform-style: preserve-3d;

    perspective: 1000px;
    aspect-ratio: 23 / 32;

    @include breakpoint(nm) {
        @include flex(row, flex-start, flex-start);
        // pointer-events: none;
    }

    .quantity {
        position: absolute;
        @extend .quantity_tag;
        top: 40px;
        right: 30px;
        z-index: 20;
        cursor: default;
        transition: opacity 0.7s;
        transform-style: preserve-3d;
        perspective: 1000px;

        @include breakpoint(nm) {
            display: none;
        }

        &.edit {
            width: 50px;
        }

        span {
            padding: 8px;
        }

        input {
            height: 24px !important;
            width: 30px !important;
        }
    }
}

.flip-container {
    @media (hover: hover) {
        &.hasDouble:hover {
            .card {
                &.in-shop {
                    transform: rotateY(180deg) translateY(-30px);

                    @include breakpoint(nm) {
                        transform: rotateY(180deg);
                    }
                }

                &:not(.in-shop) {
                    transform: rotateY(180deg);

                }

                .quantity {
                    transform: rotateY(-180deg);
                    left: 30px;
                }
            }
        }

        &:not(.hasDouble):hover {
            .card {
                &.in-shop {
                    transform: rotateY(0) translateY(-30px);

                    @include breakpoint(nm) {
                        transform: rotateY(0);
                    }
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
                bottom: -45px;

                @include breakpoint(nm) {
                    bottom: 0px;
                }
            }
        }
    }

    &.active {
        &.hasDouble:hover {
            .card {
                &.in-shop {
                    transform: rotateY(180deg) translateY(-30px);

                    @include breakpoint(nm) {
                        transform: rotateY(180deg);
                    }
                }

                &:not(.in-shop) {
                    transform: rotateY(180deg);

                }

                .quantity {
                    transform: rotateY(-180deg);
                    left: 30px;
                }
            }
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
    // border-radius: 24px;
}

.back {
    transform: rotateY(180deg);
}
</style>