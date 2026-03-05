<template>
    <div>
        <div class="singles-wrapper" id="singles-wrapper">
            <!-- <div class="buttons-wrapper">
                <div><span>Filters</span></div>
                <div><span>Cart</span></div>
            </div> -->
            <Button class="absolute right-0" size="xsmall" @click="toggleModal(true)">Desde lista</Button>
            <span class="tag left" :class="[{ 'active': leftWingIsActive }]"
                @click="toggleWings('left', !wings.left)">Filtros</span>
            <span class="tag right" :class="[{ 'active': rightWingIsActive }]"
                @click="toggleWings('right', !wings.right)">Carro</span>
            <div class="filter-wrapper" :class="[{
                'active': leftWingIsActive
            }]">
                <FiltersComponent with-apply :fetching="fetching" @apply-filters="initCollection" :limit="limit"
                    ref="filtersComponent" class="w-[230px] flex-1 " />
            </div>
            <div class="cards-wrapper">
                <Tabs :tabs="tabs" :active-tab="activeTab" @change="changeTab" count-disable />

                <div v-if="!fetching" class="cards-wrapper_inner gap-8">
                    <Empty v-if="!collectionMapped.length" />
                    <div class="list">
                        <MtgCard v-for="(card, index) in collectionMapped" :id="index" :index="index" :card="card" shop
                            @add-to-cart="add" @add-to-wishlist="addWishlist" />

                    </div>
                    <Pagination class="pagination" v-model:currentPage="page" :total="collection?.total" :limit="limit"
                        :loading="fetching" />
                </div>
                <div v-else class="flex flex-row items-center justify-center w-full overflow-hidden mt-10">
                    <Loader />
                </div>
            </div>
            <div class="cart-wrapper" :class="[{ 'active': rightWingIsActive }]">
                <Cart class="h-[75vh] w-full" />
            </div>
        </div>
        <Modal v-model="showModal" title="Agregar cartas desde lista" @update:modelValue="toggleModal">
            <Textarea v-model="toCart" @keyup.enter="" placeholder="Ingrese su lista copiada de Moxfield UNICAMENTE"
                class="h-[100px]"></Textarea>
            <Button @click="addToCart" :loading="addingToCart" class="mt-5" :disabled="toCart === ''">Agregar</Button>
        </Modal>
    </div>
</template>
<script setup>
import { ref, watch, onMounted, computed, onUnmounted } from "vue";

import Cart from "@/components/shop/Cart.vue";
import MtgCard from "@/components/MtgCard.vue";
import Pagination from "@/components/Pagination.vue";
import FiltersComponent from "@/components/mtg/FiltersComponent.vue";
import useCollection from "@/composables/mtg/useCollection";


import useCarts from '@/composables/useCart';
import { GAMES, RECIPIENTS_LISTS } from '@/utils/constants';
import Loader from "@/components/atomic/Loader.vue";
import Tabs from "@/components/atomic/Tabs.vue";
import Empty from "@/components/atomic/Empty.vue";
import Button from "@/components/atomic/Button.vue";
import Modal from "@/components/atomic/Modal.vue";
import Textarea from "@/components/atomic/Textarea.vue";
import { parseList } from "@/utils/utils";
import useDevices from "@/composables/useDevices";
const devices = useDevices();

const tabs = ref([{ index: 0, value: 'normal', name: "normal" }, { index: 1, value: 'foil', name: "foil" }])
const activeTab = ref(0);
const toCart = ref("");
const showModal = ref(false);
const addingToCart = ref(false);

const wings = ref({ left: false, right: false })
const { add } = useCarts(GAMES.MAGIC);
const { add: addWishlist } = useCarts(GAMES.MAGIC, RECIPIENTS_LISTS.WISHLIST);

const { fetchCollection, collection, collectionMapped, fetching, getListToCart } = useCollection();
const filtersComponent = ref(null)
const cardFilters = ref({});
const params = ref({ page: 1 });


const page = ref(1);
const limit = computed(() => {
    let val = 12;
    const wd = devices.width.value;
    if (wd >= 2560) {
        val = 30
    } else if (wd >= 1920) {
        val = 25
    } else if (wd >= 1660) {
        val = 24
    } else if (wd >= 1366) {
        val = 21
    } else if (wd < 1366) {
        val = 18
    }
    return val;
});

const leftWingIsActive = computed(() => devices?.width?.value > 1000 ? false : wings.value.left)
const rightWingIsActive = computed(() => devices?.width?.value > 1000 ? false : wings.value.right)


const toggleModal = (val) => {
    showModal.value = val;
    toCart.value = "";
}
const toggleWings = (wing, value) => {
    Object.keys(wings.value).forEach(x => {
        wings.value[x] = false;
        if (x === wing) {
            wings.value[x] = value;
        }

    })
}
async function addToCart() {
    try {
        addingToCart.value = true;
        const list = parseList(toCart.value);
        const result = await getListToCart(list);
        for (let index = 0; index < result.length; index++) {
            const element = result[index];
            const ele2 = list[index];
            add({ item: element, quantity: ele2.quantity, alert: index + 1 === result.length })
        }

        toggleModal(false);
        addingToCart.value = false;
    } catch (error) {
        console.error(error);
        addingToCart.value = false;
    }
}

async function initCollection(addParams = null, filt = null) {
    if (fetching.value) return;
    if (filt) {
        cardFilters.value = filt;
    }

    params.value = {
        page: page.value,
        offset: (page.value - 1) * limit.value,
        limit: limit.value,
        treatment: addParams?.treatment || tabs.value[activeTab.value]?.value,
        cardWhere: JSON.stringify(cardFilters.value || {}),
        cards: true,
        ...(addParams || {}),
    };

    toggleWings();
    await fetchCollection(params.value)

}

async function changeTab(tab) {
    activeTab.value = tab.index;
    page.value = 1;
    await initCollection({ ...params.value, page: 1, offset: 0, limit: limit, treatment: tab.value });
}


watch(page, async () => await initCollection())
onMounted(async () => {
    document.addEventListener('keydown', ({ key }) => {
        if (key === "Escape") {
            filtersComponent?.value?.clear('outside');
        }
    });
    await initCollection();
});
onUnmounted(() => {

    document.removeEventListener('keydown', () => { })
});

</script>

<style lang="scss" scoped>
.singles-wrapper {
    // padding: 0 4px;
    width: 100%;
    position: relative;
    display: grid;
    scrollbar-width: none;

    @include breakpoint(nm) {
        // grid-template-columns: 230px auto 170px;
        grid-template-columns: 100%;
    }

    @include breakpoint(hd) {
        grid-template-columns: 230px auto 200px;
    }

    @include breakpoint(hd2) {
        grid-template-columns: 230px auto 270px;
    }

    .tag {
        writing-mode: vertical-rl;
        text-orientation: upright;
        position: absolute;
        z-index: 9999;
        width: min-content;
        padding: 8px 2px;
        @include bg-site();
        top: 10%;

        transition: all 0.5s ease-out;

        &.left {
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
            left: -2px;

            filter: drop-shadow(4px 2px 2px #000);

            &.active {
                left: 230px;
                z-index: 10000;
            }
        }

        &.right {
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
            right: -2px;
            filter: drop-shadow(-4px 2px 2px #000);


            &.active {
                right: 90%;
                z-index: 10000;
            }
        }
    }

    .filter-wrapper {
        width: 100%;
        height: 75vh;
        width: 100%;
        overflow-y: auto;
        overflow-x: hidden;

        // position: relative;
        @include breakpoint(nm) {
            height: 100%;
            position: absolute;
            z-index: 9999;
            @include bg-site();
            left: 0;
            width: 0%;
            transition: all 0.5s ease-out;

            &.active {
                width: 230px;
                // left: 100%;
                z-index: 10000;
            }
        }

    }

    .cards-wrapper {
        @include flex(column, flex-start, flex-start);
        width: 100%;

        @include breakpoint(nm) {
            height: 100vh;
        }

        &_inner {
            @include flex(column, flex-start, center);
            width: 100%;
            position: relative;
            // padding-bottom: 5vh;

            .pagination {
                // position: absolute;
                bottom: 0;
                padding: 10px 0;
                width: -webkit-fill-available;
            }

            .list {
                padding-top: 30px;
                height: 75vh;
                width: 100%;
                overflow-x: hidden !important;
                @include grid($columns: 1, $gap: 32px);
                width: 100%;
                justify-items: center;

                @include breakpoint(nm) {
                    @include grid($columns: 2, $gap: 32px);
                    height: 100vh;
                    overflow-y: auto;
                    scrollbar-width: none;
                    padding-bottom: 10px;
                }

                @include breakpoint(hd) {
                    @include grid($columns: 2, $gap: 32px);
                    height: 75vh;
                    overflow-y: auto;
                }

                @include breakpoint(hd2) {
                    @include grid($columns: 3, $gap: 32px);
                }

                @include breakpoint(fhd) {
                    @include grid($columns: 4, $gap: 32px);
                }

                @include breakpoint(fhd2) {
                    @include grid($columns: 5, $gap: 32px);
                }

                @include breakpoint(fhd3) {
                    @include grid($columns: 6, $gap: 32px);
                }
            }
        }
    }

    .cart-wrapper {
        @include breakpoint(nm) {
            position: absolute;
            z-index: 99999;
            @include bg-site();
            width: 0%;
            right: 0;
            transition: all 0.5s ease-out;
            height: 100%;
            overflow-y: auto;

            &.active {
                width: calc(100% - 10%);
                // right: 100%;
                z-index: 10000;
            }

        }
    }
}
</style>
