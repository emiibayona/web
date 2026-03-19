<template>
    <div>
        <div class="singles-wrapper" id="singles-wrapper">
            <Button class="absolute right-0" size="xsmall" @click="toggleModal(true)">Agregar desde lista</Button>
            <span class="tag left"
                :class="[{ 'active': leftWingIsActive }, { 'opacity-30 hover:opacity-100': rightWingIsActive }]"
                @click="toggleWings('left', !wings.left)">Filtros</span>
            <span class="tag right"
                :class="[{ 'active': rightWingIsActive }, { 'opacity-30 hover:opacity-100': leftWingIsActive }]"
                @click="toggleWings('right', !wings.right)">Carro</span>

            <div class="filter-wrapper" :class="[{
                'active': leftWingIsActive
            }]">
                <FiltersComponent with-apply :fetching="fetching" @apply-filters="initCollection" :limit="limit"
                    title="Filtros" without-move ref="filtersComponent" class="w-[230px] flex-1 ">
                    <template #binder>
                        <Button v-if="binderActive" class="mt-3" @click="removeBinder" size="block-xy"
                            wrap="normal">Mostrar
                            todas las
                            cartas
                            disponibles</Button>
                    </template>
                </FiltersComponent>
            </div>
            <div class="cards-wrapper">
                <Tabs :tabs="tabs" :active-tab="activeTab" @change="changeTab" count-disable />
                <div v-if="!fetching && !mounting" class="cards-wrapper_inner gap-8">
                    <Empty v-if="!collectionMapped.length && (!mounting || !fetching)" />
                    <div class="list">
                        <MtgCard v-for="(card, index) in collectionMapped" :id="index" :index="index" :card="card" shop
                            @add-to-cart="add" @add-to-wishlist="addWishlist" />

                    </div>
                    <Pagination class="pagination" v-model:currentPage="page" :total="collection?.total" :limit="limit"
                        :loading="fetching" />
                </div>
                <div v-else
                    class="flex flex-row items-center justify-center w-full min-h-[350px] overflow-hidden mt-10">
                    <Loader />
                </div>
            </div>
            <div class="cart-wrapper" :class="[{ 'active': rightWingIsActive }]">
                <Cart class="h-[75vh] w-full" />
            </div>
        </div>
        <Modal v-model="showModal" title="Agregar cartas desde lista" close-disabled>
            <Textarea v-model="toCart" @keyup.enter="" placeholder="Lista exportada desde moxfield unicamente
            Ejemplo:
            1 Cloud of Faeries (DMR) 43 *F*
            1 Devoted Druid (SPG) 138 *F*
            1 Dust Bowl (EOS) 12
            ...." class="h-[200px]"></Textarea>
            <div class="flex flex-row justify-between">
                <Button @click="toggleModal(false)" :loading="addingToCart" class="mt-5">Cerrar</Button>
                <Button @click="addToCart" :loading="addingToCart" class="mt-5"
                    :disabled="toCart === ''">Agregar</Button>
            </div>
        </Modal>
        <Modal v-model="showNotAdded" title="Cartas no agregadas, no disponibles" close-disabled>
            <div class="flex flex-col gap-1 h-[300px] overflow-y-scroll">
                <div v-for="(card, index) in assembleList(listNotAdded)" :key="`card-not-added-${index}`">
                    <span>{{ card }}</span>
                </div>
            </div>

            <Button @click="toggleNotAdded" class="mt-5 self-end">Cerrar</Button>
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
import { parseList, assembleList } from "@/utils/utils";
import useDevices from "@/composables/useDevices";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
const { width, isMobile } = useDevices();

const toast = useToast();
const route = useRoute();
const router = useRouter();
const tabs = ref([{ index: 0, value: 'normal', name: "normal" }, { index: 1, value: 'foil', name: "foil" }])
const activeTab = ref(0);
const toCart = ref("");
const showModal = ref(false);
const showNotAdded = ref(false);
const addingToCart = ref(false);
const listNotAdded = ref([])
const mounting = ref(true);

const wings = ref({ left: false, right: false })
const { add } = useCarts(GAMES.MAGIC);
const { add: addWishlist } = useCarts(GAMES.MAGIC, RECIPIENTS_LISTS.WISHLIST);

const { fetchCollection, collection, collectionMapped, fetching, getListToCart, binders,
    fetchBinders } = useCollection();

const binderToShow = ref(null);

const cardFilters = ref({});
const filtersComponent = ref(null)
const params = ref({ page: 1 });
const page = ref(1);

const limit = computed(() => {
    if (isMobile.value) return 20;
    let val = 12;
    const wd = width.value;
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

const leftWingIsActive = computed(() => width?.value > 1000 ? false : wings.value.left)
const rightWingIsActive = computed(() => width?.value > 1000 ? false : wings.value.right)
const binderActive = computed(() => !!route.query.binder)

const toggleModal = (val) => {
    showModal.value = val;
    toCart.value = "";
}
const toggleNotAdded = () => { showNotAdded.value = false; listNotAdded.value = [] }
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
        if (list.every(x => Object.values(x).every(x => x !== undefined))) {
            const result = await getListToCart(list);
            for (let index = 0; index < list.length; index++) {
                const eleWantToAdd = list[index];
                const element = result.find(x =>
                    x.collector_number === eleWantToAdd.collector_number &&
                    x.name === eleWantToAdd.name &&
                    x.set === eleWantToAdd.set &&
                    x.treatment === eleWantToAdd.treatment)
                if (element) {
                    add({ item: element, quantity: Math.max(element.quantity, eleWantToAdd.quantity), alert: index + 1 === list.length })
                } else {
                    listNotAdded.value.push(eleWantToAdd)
                }
            }
            toggleModal(false);
            if (listNotAdded.value && list) {
                showNotAdded.value = true;
            }
        } else {
            toast.add({
                severity: "error",
                summary: "ERROR",
                detail: `La lista ingresada posee todas cartas con el formato equivocado`,
                life: 3000,
            })
        }
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
        binder: binderToShow?.value?.id || null,
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

async function removeBinder() {
    binderToShow.value = null;
    router.replace({ query: {} });
    await initCollection();
}

watch(page, async () => await initCollection())
onMounted(async () => {
    document.addEventListener('keydown', ({ key }) => {
        if (key === "Escape") {
            filtersComponent?.value?.clear('outside');
        }
    });
    await fetchBinders(import.meta.env.VITE_SELLER_COLLECTION_ID);
    binderToShow.value = binders?.value?.find(x => x.id === route.query.binder) || null
    await initCollection();
    mounting.value = false;
});
onUnmounted(() => {
    document.removeEventListener('keydown', () => { })
});

</script>

<style lang="scss" scoped>
.singles-wrapper {
    width: 100%;
    position: relative;
    display: grid;
    scrollbar-width: none;

    @include breakpoint(nm) {
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
        position: fixed;
        z-index: 9999;
        width: min-content;
        padding: 8px 2px;
        @include bg-site();
        top: 30%;

        transition: all 0.5s ease-out;

        display: none;
        border-top: 2px solid black;
        border-bottom: 2px solid black;

        @include breakpoint (nm) {
            display: block;
        }

        &.left {
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
            left: -2px;
            border-right: 2px solid black;


            &.active {
                left: 230px;
                z-index: 10000;
            }
        }

        &.right {
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
            right: -2px;

            border-left: 2px solid black;


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
        scrollbar-width: thin;



        // position: relative;
        @include breakpoint(nm) {
            height: 100vh;
            position: fixed;
            z-index: 9999;
            top: 0;
            @include bg-site();
            scrollbar-width: none;
            // background-color: red;
            ;
            left: 0;
            width: 0%;
            transition: all 0.5s ease-out;

            &.active {
                width: 230px;
                z-index: 10000;
            }
        }

    }

    .cards-wrapper {
        @include flex(column, flex-start, flex-start);
        width: 100%;

        &_inner {
            @include flex(column, flex-start, center);
            width: 100%;
            position: relative;

            .pagination {
                bottom: 0;
                padding: 10px 0;
                width: -webkit-fill-available;
            }

            @include breakpoint(hd) {
                max-height: 93%;
            }

            .list {
                padding-top: 30px;
                width: 100%;
                overflow-x: hidden !important;
                @include grid($columns: 1, $gap: 32px);
                width: 100%;
                justify-items: center;
                scrollbar-width: thin;

                @include breakpoint(nm) {
                    @include grid($columns: 1, $gap: 32px);
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
                    height: 75vh;
                }

                @include breakpoint(fhd) {
                    @include grid($columns: 4, $gap: 32px);
                    height: 75vh;
                }

                @include breakpoint(fhd2) {
                    @include grid($columns: 5, $gap: 32px);
                    height: 75vh;
                }

                @include breakpoint(fhd3) {
                    @include grid($columns: 6, $gap: 32px);
                    height: 75vh;
                }
            }
        }
    }

    .cart-wrapper {
        height: 80vh;
        overflow-y: auto;

        @include breakpoint(nm) {
            height: 100vh;
            position: fixed;
            z-index: 9999;
            top: 0;
            @include bg-site();
            width: 0%;
            right: 0;
            transition: all 0.5s ease-out;
            height: 100vh;
            overflow-y: auto;

            &.active {
                width: calc(100% - 10%);
                z-index: 10000;
            }

        }
    }
}
</style>
