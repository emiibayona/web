<template>
    <div class="flex flex-col">
        <h1 class="my-4">My Collection</h1>
        <div class="sticky mb-2 top-0 h-min w-full shadow-xl z-10 rounded-sm bg-site">
            Filters
            <div class="flex flex-row gap-3 h-10 items-center">
                <!-- <div v-for="color in ['W', 'U', 'B', 'G', 'R', 'Cless']">
                    <div class="flex flex-row justify-center items-center p-1 rounded-md hover:bg-slate-300 cursor-pointer "
                        :class="{ 'bg-gt-moustard-700': currentFilters?.colors?.includes(color) }">
                        <span @click="() => colorFilter(color)"> {{ color }}</span>
                    </div>
                </div> -->
            </div>
            <Filters v-model:currentFilters="currentFilters" />
        </div>
        <div class=" flex flex-col items-center w-full gap-2 pb-10 max-w-[1800px]"
            :class="{ 'overflow-hidden': loading }">
            <div v-if="loading"
                class="bg-site w-full h-full absolute top-0 z-10 flex flex-row justify-center items-center ">
                <!-- mt-[128px] -->
                <Loader />
            </div>

            <div class="grid grid-cols-5 gap-8 max-w-[1600px]">
                <MtgCard v-for="(card, index) in localCollection" :id="index" :card="card" />
            </div>

            <Pagination v-model:currentPage="page" :total="collection?.total" :limit="limit" :loading="loading"
                @page-changed="fetchLocalCollection" />
        </div>
    </div>
</template>

<script setup>
import Loader from '@/components/atomic/Loader.vue';
import Filters from '@/components/Filters.vue';
import MtgCard from '@/components/MtgCard.vue';
import Pagination from '@/components/Pagination.vue';
import { useCollectionStore } from '@/stores/collection'
import { computed, onMounted, ref, watch } from 'vue';
const store = useCollectionStore();
const collection = computed(() => store.collection)
const localCollection = ref([]);
const page = ref(1);
const limit = 15;
const loading = ref(false);
const currentFilters = ref({})

const currentUser = "emii.bayona22@gmail.com";

async function fetchLocalCollection(params, filters = currentFilters.value) {
    console.log("Filters", filters)
    const app = document.getElementById("app");
    app.style.overflow = "hidden";
    page.value = params.page || 1;
    loading.value = true;
    await store.fetchCollection(currentUser, { ...params, cardWhere: JSON.stringify(filters), cards: true });
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
watch(currentFilters, async () => {
    loading.value = true;
    page.value = 1;
    await fetchLocalCollection({
        page: page.value,
        offset: (page.value - 1) * limit,
        limit: limit,
    }, currentFilters.value)
}, { deep: true })
</script>

<style lang="scss" scoped>
.flip-container {
    background-color: transparent;
    border: 1px solid #ccc;
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