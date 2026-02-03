<template>
    <div class="flex flex-col gap-1 w-full px-4">
        <span class="font-bold text-xl">Filters</span>
        <div class="flex flex-col justify-around gap-1">
            <slot name="expansions"></slot>
            <slot name="apply"></slot>
        </div>
        <div v-if="filtersMapped">
            <div v-for="(groupFilter, index) in filtersMapped" :id="`fg-${index}`" class="flex flex-col mt-4 mb-2">
                <span class="font-bold">{{ groupFilter[0] }}</span>
                <div v-if="groupFilter[0] !== 'Colors'" class="flex flex-col gap-1">
                    <Checkbox v-for="(filter, index_2) in groupFilter[1]" :checked="filter.checked"
                        :label="filter.label" :id="`${groupFilter[0]}-${index_2}`"
                        @update="val => applyFilter(val, filter)" />
                </div>
                <div v-else class="flex flex-row h-10 items-center">
                    <div v-for="color in groupFilter[1]">
                        <div class="flex flex-row justify-center items-center p-2 rounded-md hover:bg-gt-moustard-200 cursor-pointer active:bg-gt-moustard-500"
                            :class="{ 'bg-gt-moustard-700': color.checked }"
                            @click="applyFilter(!color.checked, color)">
                            <span>
                                <img :src="`/src/assets/img/mtg/${color.value}.SVG`" class="h-4 w-4" />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import Checkbox from '@/components/atomic/Checkbox.vue';
import useFilters from '@/composables/useFilters';
import { GAMES } from '@/utils/constants.js';

const { magicFilters } = useFilters(GAMES.MAGIC);
const filtersMapped = ref(null);
function applyFilter(val, filter) {
    console.log(val, filter)
    filter.checked = val;
}
onMounted(() => {
    filtersMapped.value = Object.entries(magicFilters.value);
});

const activeFilters = ref({});

watch(filtersMapped, () => {
    const active = {};
    if (!filtersMapped.value) return active;
    filtersMapped.value.forEach(([group, filters]) => {
        const checkedFilters = filters.filter(f => f.checked).map(f => f.value);
        if (checkedFilters.length > 0) {
            active[group.toLowerCase()] = checkedFilters;
        }
    });
    activeFilters.value = active;
}, { deep: true });

defineExpose({ activeFilters })
</script>

<style lang="scss" scoped></style>