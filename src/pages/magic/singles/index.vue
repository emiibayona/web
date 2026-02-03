<template>
    <div class="flex flex-col gap-4 ">
        <NavList class="hidden md:flex space-x-4 justify-around items-center pt-5 pb-10" />

        <div class="grid grid-cols-6 gap-4 2xl:gap-2 2xl:grid-cols-7">
            <div class="flex flex-row border-r-2 border-black relative">
                <Filters ref="filters">
                    <template #expansions>
                        <Dropdown class="w-full" :model-value="expansionSelected"
                            :items="[{ label: 'Lorwyn Eclipsed', value: 'lorwyn-eclipsed' }, { label: 'Lorwyn Eclipsed Variants', value: 'lorwyn-eclipsed-variants' }, { label: 'Modern Horizons 3', value: 'modern-horizons-3' }, { label: 'Modern Horizons 3 Variants', value: 'modern-horizons-3-variants' }]"
                            placeholder="Expansion" @update:model-value="(va) => expansionSelected = va" />
                    </template>
                    <template #apply>
                        <button
                            class="mt-4 p-2 border border-black hover:shadow-lg hover:bg-slate-400 hover:cursor-pointer rounded-md transition-all duration-300 ease-in-out"
                            @click="applyIt">Apply
                            Filters</button>
                    </template>
                </Filters>
            </div>
            <div class="col-span-5 w-full flex flex-col justify-center">
                <InputField v-if="!loading" placeholder="Search singles..." class="self-end mx-4 my-5 w-full h-10"
                    @search="searched = $event" :model-value="searched" />
                <div v-if="!loading" class="flex flex-row mb-4 w-full h-min border-b-2 border-black">
                    <div class="p-2 hover:bg-slate-400 hover:cursor-pointer hover:rounded-md transition-all duration-300 ease-in-out"
                        :class="['']">
                        <span>Normal</span>
                    </div>
                    <div class="ml-3 p-2 border-black  hover:bg-slate-400 hover:cursor-pointer hover:rounded-md transition-all duration-300 ease-in-out"
                        :class="['border-t-2 border-l-2 border-r-2 -mb-[1px]']">
                        <span>Foil</span>
                    </div>
                    <!-- <div class=" w-full"></div> -->
                </div>
                <div>

                    <!-- <div v-if="!loading"
                        class="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-5 2xl:grid-cols-7 2xl:gap-4"> -->
                    <!-- Example usage of GridCard component -->
                    <!-- <GridCard title="Hexing Squelcher"
                            image="https://cards.scryfall.io/large/front/6/7/674960ce-ff33-4d5e-a24a-a4582b2e9809.jpg?1767658306"
                            expansion="Lorwyn Eclipsed (R)" price="24.99" from-shop />
                        <GridCard
                            image="https://cards.scryfall.io/large/front/6/8/68618675-3e00-4b07-b1da-0e4be5700a1c.jpg?1767660870"
                            title="Hexing Squelcher" expansion="Lorwyn Eclipsed Variants (R)" price="44.99" from-shop />
                        <GridCard
                            image="https://cards.scryfall.io/large/front/1/4/145f10ab-b41b-4213-b75f-522aafe940fb.jpg?1769126263"
                            title="Hexing Squelcher" expansion="Promo Pack (R)" price="29.99" from-shop />
                        <GridCard title="Hexing Squelcher"
                            image="https://cards.scryfall.io/large/front/6/7/674960ce-ff33-4d5e-a24a-a4582b2e9809.jpg?1767658306"
                            expansion="Lorwyn Eclipsed (R)" price="24.99" from-shop />
                        <GridCard
                            image="https://cards.scryfall.io/large/front/6/8/68618675-3e00-4b07-b1da-0e4be5700a1c.jpg?1767660870"
                            title="Hexing Squelcher" expansion="Lorwyn Eclipsed Variants (R)" price="44.99" from-shop />
                        <GridCard
                            image="https://cards.scryfall.io/large/front/1/4/145f10ab-b41b-4213-b75f-522aafe940fb.jpg?1769126263"
                            title="Hexing Squelcher" expansion="Promo Pack (R)" price="29.99" from-shop />
                        <GridCard title="Hexing Squelcher"
                            image="https://cards.scryfall.io/large/front/6/7/674960ce-ff33-4d5e-a24a-a4582b2e9809.jpg?1767658306"
                            expansion="Lorwyn Eclipsed (R)" price="24.99" from-shop />
                        <GridCard
                            image="https://cards.scryfall.io/large/front/6/8/68618675-3e00-4b07-b1da-0e4be5700a1c.jpg?1767660870"
                            title="Hexing Squelcher" expansion="Lorwyn Eclipsed Variants (R)" price="44.99" from-shop
                            is-foil />
                        <GridCard
                            image="https://cards.scryfall.io/large/front/1/4/145f10ab-b41b-4213-b75f-522aafe940fb.jpg?1769126263"
                            title="Hexing Squelcher" expansion="Promo Pack (R)" price="29.99" from-shop /> -->
                    <!-- <div class="grid grid-cols-5 gap-8 max-w-[1600px]">
                            <div v-for="(card, index) in localCollection" :id="index" class="flip-container">

                            </div>
                        </div> -->
                    <!-- </div> -->
                    <div v-if="!loading">
                        <div class="grid grid-cols-4 gap-8 max-w-[1600px]">
                            <MtgCard v-for="(card, index) in localCollection" :id="index" :card="card" />
                        </div>
                        <Pagination v-model:currentPage="page" :total="collection?.total" :limit="limit"
                            :loading="loading" @page-changed="fetchLocalCollection" />
                    </div>
                    <div v-else class="col-span-4 2xl:col-span-5 flex flex-row">
                        <div
                            class="flex flex-row min-h-[140px] w-full justify-center gap-4 mt-4 overflow-x-scroll rounded-lg p-6 lg:overflow-visible">
                            Loading
                            <svg class="text-gray-300 animate-spin" viewBox="0 0 64 64" fill="none"
                                xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                                <path
                                    d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
                                    stroke="currentColor" stroke-width="5" stroke-linecap="round"
                                    stroke-linejoin="round">
                                </path>
                                <path
                                    d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
                                    stroke="currentColor" stroke-width="5" stroke-linecap="round"
                                    stroke-linejoin="round" class="text-gray-900">
                                </path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex flex-row border-l-2 border-black pl-6">
                <Cart />
            </div>
        </div>

    </div>
</template>

<script setup>
import GridCard from "@/components/shop/GridCard.vue";
import NavList from "@/components/NavList.vue";
import Filters from "@/components/shop/Filters.vue";
// import Filters from '@/components/Filters.vue';
import { computed, ref, watch, onMounted } from "vue";
import InputField from "@/components/atomic/InputField.vue";
import Dropdown from "@/components/atomic/Dropdown.vue";
import Cart from "@/components/shop/Cart.vue";
import Loader from '@/components/atomic/Loader.vue';
import MtgCard from '@/components/MtgCard.vue';
import Pagination from '@/components/Pagination.vue';
import { useCollectionStore } from '@/stores/collection'

const loading = ref(false);
const filters = ref(null);
const expansionSelected = ref(null);
const searched = ref('');

// TODO: clean it


const store = useCollectionStore();
const collection = computed(() => store.collection)
const localCollection = ref([]);
const page = ref(1);
const limit = 15;
const currentFilters = ref({})

const currentUser = "emii.bayona22@gmail.com";

async function fetchLocalCollection(params, query = filters?.value?.activeFilters) {
    console.log("Filters", query)
    const app = document.getElementById("app");
    app.style.overflow = "hidden";
    page.value = params.page || 1;
    loading.value = true;
    await store.fetchCollection(currentUser, { ...params, cardWhere: JSON.stringify(query), cards: true });
    localCollection.value = localCollection.value?.length === collection.value.data.length ? localCollection.value : []
    collection.value?.data?.forEach((cd, index) => {
        const cardToShow = { ...cd, image: loadImg(cd.card) }
        if (localCollection.value?.length === collection.value.data.length) {
            localCollection.value[index] = cardToShow
        } else {
            localCollection.value.push(cardToShow)
        }
    })
    setTimeout(() => {
        loading.value = false;
        app.scroll({ top: 0, behavior: 'smooth' });
        document.getElementById("app").style.overflow = "auto";
    }, 1000)
}

onMounted(async () => {
    await fetchLocalCollection({ limit, offset: 0 });
})

const loadImg = (card) => {
    const sources = { hasDouble: false, faceUp: null, faceDown: null };
    if (card?.card_faces?.length && card?.card_faces?.every(x => x.image_uris)) {
        sources.faceUp = card.card_faces[0]?.image_uris?.png;
        sources.faceDown = card.card_faces[1]?.image_uris?.png;
        sources.hasDouble = true;
    } else {
        sources.faceUp = card?.image_uris?.png || card?.image_uris?.large;
    }
    return sources;
};

// watch(currentFilters, async () => {
//     loading.value = true;
//     page.value = 1;
//     await fetchLocalCollection({
//         page: page.value,
//         offset: (page.value - 1) * limit,
//         limit: limit,
//     }, currentFilters.value)
// }, { deep: true })
async function initCollection(addParams) {
    page.value = 1;
    await fetchLocalCollection({
        page: page.value,
        offset: (page.value - 1) * limit,
        limit: limit,
        ...addParams
    }, filters?.value?.activeFilters)
}

watch(searched, async () => {
    await initCollection({ name: searched.value })
}, { deep: true })
async function applyIt() {

    // TODO: button active if the params are differents from the previous search
    // if (Object.values(filters?.value?.activeFilters || {}).length || searched.value) {

    await initCollection();

    // loading.value = true;
    // const active = filters.value.activeFilters;
    // console.log("Active Filters:", active);

    // setTimeout(() => {
    //     loading.value = false;
    // }, 1000);
    // }
}
</script>

<style lang="scss" scoped></style>