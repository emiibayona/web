<template>
    <div class="flex flex-col gap-4 w-full">
        <div class="flex flex-row w-full h-min border-b-2 border-black" :class="[`mb-${margin}`]">
            <div v-for="(tab) in tabs" :key="`tab-${tab.index}`" class="p-2 border-black hover:cursor-pointer bg-site "
                :class="[activeTab === tab.index && activeTabClass, { 'border-l-0': activeTab === 0 && activeTab === tab.index }, { 'border-l-2': activeTab === tab.index && tab.index >= 1 }]"
                @click="changeTab(tab)">
                <span>{{ capitalizeFirstLetter(tab.name) }}</span>
                <span v-if="!countDisable" class="font-bold ml-2">(<span class="font-normal">{{ tab.count || 0
                        }}</span>)</span>
            </div>
        </div>
        <!-- <div> -->
        <slot></slot>
        <!-- </div> -->
    </div>
</template>

<script setup>
import { capitalizeFirstLetter } from '@/utils/utils';

const activeTabClass = "border-t-2 border-r-2 -mb-[2px]";
defineProps({ tabs: { type: Array, default: () => [] }, activeTab: { type: Number, default: 0 }, count: { type: Number, default: 0 }, countDisable: { type: Boolean, default: false }, margin: { type: Number, default: 0 } })
const emit = defineEmits(['change']);
function changeTab(val) {
    emit("change", val)
}

</script>

<style lang="scss" scoped></style>