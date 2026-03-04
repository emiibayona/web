<template>
    <div>


        <div class="singles-wrapper" id="singles-wrapper">
            <div class="filter-wrapper">
                <Button class="absolute right-0" size="xsmall" @click="toggleModal(true)">Desde lista</Button>
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
                    <Pagination v-model:currentPage="page" :total="collection?.total" :limit="limit"
                        :loading="fetching" />
                </div>
                <div v-else class="flex flex-row items-center justify-center w-full overflow-hidden mt-10">
                    <Loader />
                </div>
            </div>
            <div>
                <Cart class="h-[75vh]" />
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

const tabs = ref([{ index: 0, value: 'normal', name: "normal" }, { index: 1, value: 'foil', name: "foil" }])
const activeTab = ref(0);
const toCart = ref("");
const showModal = ref(false);
const addingToCart = ref(false);

const { add } = useCarts(GAMES.MAGIC);
const { add: addWishlist } = useCarts(GAMES.MAGIC, RECIPIENTS_LISTS.WISHLIST);

const { fetchCollection, collection, collectionMapped, fetching, getListToCart } = useCollection();
const filtersComponent = ref(null)
const cardFilters = ref({});
const params = ref({ page: 1 });

const page = ref(1);
const limit = computed(() => {
    const wd = width?.value;
    if (wd >= 2560) {
        return 30
    } else if (wd >= 1920) {
        return 25
    } else if (wd >= 1660) {
        return 24
    } else if (wd >= 1366) {
        return 21
    } else if (wd < 1366) {
        return 18
    } else {
        return 12
    }
});

// TODO: Move to composable, it's not working
const width = ref(window.innerWidth);
const height = ref(window.innerHeight);

const handleResize = () => {
    width.value = window.innerWidth;
    height.value = window.innerHeight;
};

const toggleModal = (val) => {
    showModal.value = val;
    toCart.value = "";
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
    // console.log(JSON.parse(JSON.stringify(params.value)));
    await fetchCollection(params.value, localStorage.getItem("seller"))

}

async function changeTab(tab) {
    activeTab.value = tab.index;
    page.value = 1;
    await initCollection({ ...params.value, page: 1, offset: 0, limit: limit, treatment: tab.value });
}


watch(page, async () => await initCollection())
onMounted(async () => {
    window.addEventListener("resize", handleResize);
    document.addEventListener('keydown', ({ key }) => {
        if (key === "Escape") {
            filtersComponent?.value?.clear('outside');
        }
    });
    await initCollection();
});
onUnmounted(() => {
    window.removeEventListener("resize", handleResize);
    document.removeEventListener('keydown')
});

</script>

<style lang="scss" scoped>
.singles-wrapper {
    width: 100%;
    position: relative;
    display: grid;

    @include breakpoint(nm) {
        grid-template-columns: 230px auto 170px;
    }

    @include breakpoint(hd) {
        grid-template-columns: 230px auto 200px;
    }

    @include breakpoint(hd2) {
        grid-template-columns: 230px auto 270px;
    }

    .filter-wrapper {
        width: 100%;
        height: 75vh;
        width: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        // position: relative;

    }

    .cards-wrapper {
        @include flex(column, flex-start, flex-start);
        width: 100%;

        &_inner {
            @include flex(column, flex-start, center);
            width: 100%;

            .list {
                padding-top: 30px;
                height: 75vh;
                width: 100%;
                overflow-y: auto;
                overflow-x: hidden;
                @include grid($columns: 1, $gap: 32px);
                width: 100%;
                justify-items: center;

                @include breakpoint(nm) {
                    @include grid($columns: 2, $gap: 32px);
                }

                @include breakpoint(hd) {
                    @include grid($columns: 2, $gap: 32px);
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

    .cart-wrapper {}
}
</style>
