<template>
    <div>
        <div class="flex flex-col">
            <Modal v-model="showAddModal" title="Agregar a la coleccion" :close-disabled="uploading">
                <div class="w-full flex flex-col gap-5">
                    <div class="bg-gt-dark-500 h-16 w-full flex flex-row items-center justify-center">
                        <input type="file" accept=".csv" required id="csvpicker" />
                    </div>
                    <div class="flex flex-col">
                        <span class="text-xl mb-4">Binder:</span>
                        <span class="font-thin text-xs mb-2">Si no eliges un binder, se colocara en el default</span>
                        <div class="flex flex-row w-full gap-2">
                            <!-- <span class="text-xl w-1/2">Default</span> -->
                            <InputField :modelValue="binderTyped" class="w-1/2" placeholder="Escribe un nombre"
                                @input="val => binderTyped = val" type="text" />
                            <Dropdown class="w-1/2 hover:opacity-100"
                                :class="[{ 'opacity-25': (!binderTyped || binderTyped !== '') && !binderSelected }]"
                                :items="bindersMapped" :model-value="binderSelected"
                                @update:model-value="(va) => binderSelected = va">
                            </Dropdown>
                        </div>
                    </div>

                    <Button size="block" @click="uploadCards" :disabled="uploading"
                        :loading="uploading">Confirmar</Button>
                </div>
            </Modal>


            <div class="singles-wrapper" id="singles-wrapper">
                <div class="filter-wrapper border-r-2 border-black">
                    <div class="flex flex-row gap-5 mb-2 items-center sticky top-0 bg-site ">
                        <h1 class="font-bold">Mi Collection</h1>
                        <Button size="xsmall" @click="openAddCardsModal(true)">
                            + Agregar cartas
                        </Button>
                    </div>
                    <div class="filter-wrapper-list">
                        <FiltersComponent @apply-filters="initCollection" ref="filtersComponent"
                            @clean="searched = null" class="w-[230px] flex-1">
                            <template #search>
                                <InputField v-if="!loading" placeholder="Search singles..." @input="searched = $event"
                                    :model-value="searched" />
                            </template>
                        </FiltersComponent>
                    </div>
                </div>

                <div v-if="!onFetching" class="cards-wrapper_inner gap-8">
                    <div class="list ">
                        <MtgCard v-for="(card, index) in collectionMapped" :id="index" :card="card" flip-disable />
                    </div>
                    <Pagination v-model:currentPage="page" :total="collection?.total" :limit="limit"
                        :loading="onFetching" class="py-5" />
                </div>
                <div v-else class="flex flex-row items-center justify-center w-full overflow-hidden">
                    <Loader />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Button from '@/components/atomic/Button.vue';
import Dropdown from '@/components/atomic/Dropdown.vue';
import InputField from '@/components/atomic/InputField.vue';
import Loader from '@/components/atomic/Loader.vue';
import Modal from '@/components/atomic/Modal.vue';
import FiltersComponent from '@/components/mtg/FiltersComponent.vue';
import MtgCard from '@/components/MtgCard.vue';
import Pagination from '@/components/Pagination.vue';
import useCollection from '@/composables/mtg/useCollection';
import { useToast } from "primevue/usetoast";
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

const toast = useToast();
const { fetchCollection, collection, collectionMapped, onFetching, binders, fetchBinders, createBinder, addCards } = useCollection();

const loading = ref(false);
const uploading = ref(false);
const showAddModal = ref(false);


const bindersMapped = computed(() => binders?.value?.map(x => ({ value: x, label: x.name, })))
const binderSelected = ref(null);
const binderTyped = ref(null)

const searched = ref("");
const cardFilters = ref({});
const filtersComponent = ref(null)
const params = ref({});
const page = ref(1);

const limit = computed(() => {
    const wd = width?.value;
    if (wd >= 2560) {
        return 28
    } else if (wd >= 1920) {
        return 28
    } else if (wd >= 1660) {
        return 25
    } else if (wd >= 1366) {
        return 24
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
        offset: (page.value - 1) * limit.value,
        limit: limit.value,
        cardWhere: JSON.stringify(cardFilters.value || {}),
        cards: true,
        name: searched.value || null,
        ...(addParams || {}),
    };

    await fetchCollection(params.value, localStorage.getItem("user"))

}
function openAddCardsModal(val = true) {
    binderSelected.value = val ? binders.value.find(x => x.name === "default") || null : null;
    binderTyped.value = null;
    uploading.value = false;
    showAddModal.value = val;
}
async function uploadCards() {
    try {
        uploading.value = true;
        const elem = document?.getElementById("csvpicker");
        if (!elem.files.length) {
            uploading.value = false;
            return toast.add({
                severity: "error",
                summary: "Error",
                detail: "Archivo con cartas requerido",
                life: 3000,
            })
        }
        let binder = null;
        const binderTypedExisting = binders.value.find(x => x.name === binderTyped.value)
        if (binderTyped.value && !binderTypedExisting) {
            binder = await createBinder({ body: { name: binderTyped.value }, collectionId: collection.value.collectionId })
        } else {
            debugger;
            binder = binderTypedExisting || binderSelected?.value;
        }

        const form = new FormData();
        if (elem.files.length) {
            form.append("file", elem.files[0]);
            console.log("File selected: ", elem.files[0]);
        }
        form.append("binder", binder.name)
        form.append("user", localStorage.getItem("seller"))

        const result = await addCards(form);
        toast.add({
            severity: "success",
            summary: "Cartas agregadas",
            detail: `Total importadas: ${result.result.imported} en el binder ${binder.name}`,
            life: 3000,
        })
        await initCollection();
        setTimeout(() => {
            openAddCardsModal(false);
        }, 1000);
    } catch (error) {
        console.error(error)
    }
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
    await initCollection()
})
watch(binderTyped, () => {
    binderSelected.value = binderTyped.value ? null : binders.value.find(x => x.name === "default")
})
watch(binderSelected, () => {
    binderTyped.value = binderSelected.value ? null : binderTyped.value;
})
onMounted(async () => {
    window.addEventListener("resize", handleResize);
    await initCollection();
    await fetchBinders(collection?.value?.collectionId);

});
onUnmounted(() => {
    window.removeEventListener("resize", handleResize);
});

</script>

<style lang="scss" scoped>
.singles-wrapper {
    // @include flex();
    width: 100%;
    position: relative;
    display: grid;
    grid-template-columns: 230px auto;
    min-height: fill-available;

    @include breakpoint(nm) {
        // background-color: red;
        grid-template-columns: 230px auto;
    }

    .filter-wrapper {
        // width: 230px;
        width: 100%;

        &-list {
            height: 75vh;
            width: 100%;
            overflow-y: auto;
            overflow-x: hidden;

        }

    }

    .cards-wrapper {
        @include flex(column, flex-start, flex-start);
        width: 100%;


        &_inner {
            @include flex(column, flex-start, center);
            width: 100%;

            .list {
                height: 75vh;
                overflow-y: auto;
                @include grid($columns: 1, $gap: 32px);
                width: 100%;
                justify-items: center;

                @include breakpoint(nm) {
                    @include grid($columns: 3, $gap: 32px);
                }

                @include breakpoint(hd) {
                    @include grid($columns: 4, $gap: 32px);
                }

                @include breakpoint(hd2) {
                    @include grid($columns: 4, $gap: 32px);
                }

                @include breakpoint(fhd) {
                    @include grid($columns: 5, $gap: 32px);
                }

                @include breakpoint(fhd2) {
                    @include grid($columns: 5, $gap: 32px);
                }

                @include breakpoint(fhd3) {
                    @include grid($columns: 7, $gap: 32px);
                }
            }
        }
    }

    .cart-wrapper {}
}

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