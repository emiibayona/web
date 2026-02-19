<template>
    <div class="flex flex-col">
        <h1 class="my-4">My Collection</h1>
        <div class="sticky mb-2 top-0 h-min w-full z-10 rounded-sm bg-site ">
            <FiltersComponent row @apply-filters="initCollection" ref="filtersComponent" @clean="searched = null">
                <template #search>
                    <InputField v-if="!loading" placeholder="Search singles..." @search="searched = $event"
                        :model-value="searched" />
                </template>
            </FiltersComponent>
        </div>
        <div class="flex flex-col items-center w-full gap-2 pb-10" :class="{ 'overflow-hidden': onFetching }">
            <div v-if="onFetching"
                class="bg-site w-full h-full absolute top-0 z-[9] flex flex-row justify-center items-center ">
                <Loader />
            </div>
            <div id="collections-cards" class="grid grid-cols-5 gap-8 relative">
                <MtgCard v-for="(card, index) in collectionMapped" :id="index" :card="card" />
            </div>
            <Pagination v-model:currentPage="page" :total="collection?.total" :limit="limit" :loading="onFetching" />
        </div>
    </div>
</template>

<script setup>
import InputField from '@/components/atomic/InputField.vue';
import Loader from '@/components/atomic/Loader.vue';
import FiltersComponent from '@/components/mtg/FiltersComponent.vue';
import MtgCard from '@/components/MtgCard.vue';
import Pagination from '@/components/Pagination.vue';
import useCollection from '@/composables/mtg/useCollection';
import { computed, onMounted, ref, watch } from 'vue';
const loading = ref(false);



const { fetchCollection, collection, collectionMapped, onFetching } = useCollection();
const searched = ref("");
const cardFilters = ref({});
const params = ref({});
const filtersComponent = ref(null)

const page = ref(1);
const limit = 20;

async function initCollection(addParams = null, filt = null) {
    if (onFetching.value) return;
    if (filt) {
        cardFilters.value = filt;
    }
    // console.log(addParams, filt, searched.value)
    if (searched.value) {

    }
    params.value = {
        page: page.value,
        offset: (page.value - 1) * limit,
        limit: limit,
        cardWhere: JSON.stringify(cardFilters.value || {}),
        cards: true,
        name: searched.value || null,
        ...(addParams || {}),
    };

    await fetchCollection(params.value, localStorage.getItem("user"))

}
watch(
    searched,
    async () => {
        if (onFetching.value) return;
        await initCollection();
    },
    { deep: true },
);
watch(page, async () => {
    // console.log(filtersComponent?.value)
    filtersComponent?.value?.toggle();
    await initCollection()
})
onMounted(async () => {
    await initCollection();
});


</script>

<style lang="scss" scoped>
.flip-container {
    background-color: transparent;
    perspective: 1000px;
    width: 215px;
    height: 300px;
}

.card {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 1s;
    transform-style: preserve-3d;

    perspective: 1000px;

    .quantity {
        // absolute top-10 right-4 z-20 rounded-md bg-gray-800 h-6 w-7 flex flex-row justify-center items-center
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
        transition: opacity 1s;
        transform-style: preserve-3d;
        font-weight: bold;

    }
}

.flip-container {
    &.hasDouble:hover {
        .card {
            transform: rotateY(180deg);

            .quantity {
                // transform: rotateY(180deg);
                opacity: 0;
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
}

.back {
    transform: rotateY(180deg);
}
</style>