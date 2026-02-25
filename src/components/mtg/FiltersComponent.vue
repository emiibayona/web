<template>
    <div class="flex flex-row relative"
        :class="[{ 'pb-2 border-b-2 border-black': row }, { 'min-h-[50vh] border-r-2 border-black': !row }]"
        @keydown.enter.prevent="applyIt">
        <Filters ref="filters" :row="row" :collapsed="collapsed">
            <template #search>
                <div v-if="!collapsed" class="self-end mt-5 mb-3 w-full h-10">
                    <InputField placeholder="Search singles..." @input="searched = $event" :model-value="searched" />
                </div>
            </template>
            <template #expansions>
                <Dropdown v-if="!collapsed" class="w-full" :model-value="expansionSelected" :items="mappedSets"
                    placeholder="Expansion" @update:model-value="(va) => expansionSelected = va" />
            </template>

            <template #apply>
                <div class="flex flex-row justify-between gap-2" :class="[{ '': row }, { 'mt-3': !row }]">
                    <Button v-show="!collapsed && withApply" @click="applyIt" :disabled="!shouldActiveApplyFilter">
                        Aplicar
                    </Button>
                    <Button v-show="!collapsed" @click="clear" outlined :disabled="shouldClearDisabled">
                        Limpiar
                    </Button>
                </div>
            </template>
        </Filters>
        <button v-if="row" @click="collapsed = !collapsed" class="self-end"> <img src="/images/arrow.svg"
                :class="`curosr-pointer  transition-all duration-500 ease-in-out h-5 w-5 ${collapsed && 'rotate-0' || '-rotate-180'}`" /></button>
    </div>
</template>

<script setup>
import InputField from "@/components/atomic/InputField.vue";
import Filters from "@/components/shop/Filters.vue";
import { ref, watch, computed, onMounted } from "vue";
import Dropdown from "../atomic/Dropdown.vue";
import useSets from "@/composables/mtg/useSets";
import Button from "../atomic/Button.vue";
const props = defineProps({
    row: { type: Boolean, default: false },
    collapsed: { type: Boolean, default: false },
    fetching: { type: Boolean, default: false },
    withApply: { type: Boolean, default: false },
    limit: { type: Number, default: 18 }
})
const emits = defineEmits(["apply-filters", "clean"])
const { fetchSets, sets } = useSets();
const collapsed = ref(props.row && true);
const filters = ref(null);
const onClear = ref(false);
const searched = ref("");
const expansionSelected = ref(null);
const mappedSets = computed(() => sets?.value?.map(x => ({ label: x.name, value: x.code })))

const initialStateValues = { active: {}, searched: "", expansionSelected: null };
const initialState = ref({ ...initialStateValues });
const currentState = ref({ ...initialStateValues });
const setStates = (ini = null) => {
    const obj = ini || initialStateValues;
    initialState.value = { ...obj };
    currentState.value = { ...obj };
}
const shouldActiveApplyFilter = computed(() => {
    return JSON.stringify(currentState.value) !== JSON.stringify(initialState.value);
});
const shouldClearDisabled = computed(() => {
    if (props.fetching || onClear.value || shouldActiveApplyFilter.value) return true;

    return JSON.stringify(currentState.value) === JSON.stringify(initialStateValues)
})


async function clear(cal = "inside") {
    if (shouldClearDisabled.value) return;
    onClear.value = true;
    filters?.value.clean()
    searched.value = "";
    expansionSelected.value = null;
}
async function applyIt() {
    if (!shouldActiveApplyFilter.value) return;
    setStates({
        active: filters?.value?.activeFilters || {},
        searched: searched.value,
        expansionSelected: expansionSelected.value
    })
    emits("apply-filters", {
        page: 1,
        offset: 0,
        limit: props.limit, name: searched.value || ''
    }, { ...(filters?.value?.activeFilters || {}), set: expansionSelected.value || '' })
}
watch(() => [filters?.value?.activeFilters, expansionSelected.value, searched.value], () => {
    if (props.fetching) return;
    currentState.value = {
        active: filters?.value?.activeFilters || {},
        searched: searched.value,
        expansionSelected: expansionSelected.value
    };
    if (onClear.value) {
        applyIt();
        onClear.value = false;

    } else if (!props.withApply) { applyIt(); }
}, { deep: true })
onMounted(async () => { if (!sets.value.length) await fetchSets() })
defineExpose({ toggle: () => collapsed.value = !collapsed.value, clear })
</script>

<style lang="scss" scoped></style>