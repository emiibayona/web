<template>

    <div class="flex w-full transition-all duration-300 ease-in-out h-8 max-h-[150px]"
        :class="[{ 'flex-row-reverse gap-10': row }, { 'flex-col px-4 gap-1': !row }, { 'h-[150px]': !collapsed }, { 'justify-end': collapsed }, { 'justify-between': row && !collapsed }]">
        <span v-if="!row" class="font-bold text-xl">Filters</span>
        <div v-if="!collapsed" class="flex flex-col justify-around gap-1"
            :class="[{ 'min-w-[300px]': row }, { '': !row }]">
            <slot name="search"></slot>
            <slot name="expansions"></slot>

        </div>
        <div v-if="filtersMapped" class="min-w-[700px] max-w-[900px] flex"
            :class="[{ 'flex-col justify-between': row }, { 'flex-col mt-4 mb-2': !row }]">
            <div v-for="(groupFilter, index) in filtersMapped" :key="`fg-${index}-${cleaned}`">
                <!-- {{ `${groupFilter}-Collapsed:${collapsed}` }} -->
                <!-- Name -->
                <div v-if="groupFilter[0] !== 'Colors' && !collapsed" class="flex"
                    :class="[{ 'flex-row items-center h-8 ': row }, { 'flex-col mt-4 mb-2 items-start': !row }]">
                    <span class="font-bold w-[70px]">{{ groupFilter[0] }}</span>
                    <!-- Filters non-color -->
                    <div class="flex"
                        :class="[{ 'flex-row items-center flex-wrap gap-y-1 gap-x-2': row }, { 'flex-col items-start': !row }]">
                        <Checkbox v-for="(filter, index_2) in groupFilter[1]" :checked="filter.checked"
                            :label="filter.label" :key="`${groupFilter[0]}-${index_2}-${cleaned}`"
                            :id="`${groupFilter[0]}-${index_2}`" @update="val => applyFilter(val, filter)" />
                    </div>
                </div>
                <!-- Color filter -->
                <div v-else-if="groupFilter[0] === 'Colors'" class="flex"
                    :class="[{ 'flex-row': row }, { 'flex-col': !row }]">
                    <span v-if="collapsed" class="font-bold w-[70px]">{{ groupFilter[0] }}</span>
                    <div class="flex flex-row" :class="[{ 'h-8 items-center': row }, { 'h-8 items-center': !row }]">
                        <div v-for="color in groupFilter[1]">
                            <div class="flex flex-row justify-center items-center p-2 rounded-md hover:bg-gt-moustard-200 cursor-pointer active:bg-gt-moustard-500"
                                :class="{ 'bg-gt-moustard-700': color.checked }"
                                @click="applyFilter(!color.checked, color)">
                                <span class="h-4 w-4">
                                    <img :src="`/src/assets/img/mtg/${color.value}.SVG`" class="h-4 w-4" />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <slot name="apply"></slot>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import Checkbox from '@/components/atomic/Checkbox.vue';
import useFilters from '@/composables/useFilters';
import { GAMES } from '@/utils/constants.js';

defineProps({
    row: { type: Boolean, default: false }, collapsed: { type: Boolean, default: false }
})

const { magicFilters } = useFilters(GAMES.MAGIC);
const filtersMapped = ref(null);
const cleaned = ref(0);

const init = () => { filtersMapped.value = Object.entries(JSON.parse(JSON.stringify(magicFilters.value))) };

const clean = () => {
    cleaned.value++;
    init();
};

const activeFilters = ref({});

watch(filtersMapped, () => {
    const active = {};

    if (!filtersMapped.value) return;

    console.log("Filters", filtersMapped?.value)
    filtersMapped.value.forEach(([group, filters]) => {
        const checkedFilters = filters.filter(f => f.checked).map(f => f.value);
        if (checkedFilters.length > 0) {
            active[group.toLowerCase()] = checkedFilters;
        }
    });

    if (JSON.stringify(activeFilters.value) === JSON.stringify(active)) return;
    activeFilters.value = active;

}, { deep: true });

function applyFilter(val, filter) {
    filter.checked = val;
}

onMounted(() => {
    init();
});

defineExpose({ activeFilters, clean })
</script>

<style lang="scss" scoped></style>