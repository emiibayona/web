<template>
    <div class="flex flex-row justify-between">
        <div class="flex flex-row h-10 items-center">
            <div v-for="color in mtgColors">
                <div class="flex flex-row justify-center items-center p-2 rounded-md hover:bg-slate-300 cursor-pointer"
                    :class="{ 'bg-gt-moustard-700': currentFilters?.colors?.includes(color) }">
                    <span @click="() => colorFilter(color)">
                        <img :src="`/images/mtg/${color}.svg`" class="h-4 w-4" />
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { MTG } from '@/utils/constants';

const mtgColors = Object.values(MTG.COLORS);

const props = defineProps({ currentFilters: { type: Object, default: () => ({}) } })

const emit = defineEmits(['update:currentFilters']);

function colorFilter(color) {

    if (props.currentFilters?.colors) {
        if (props.currentFilters.colors.find(x => x === color)) {
            props.currentFilters.colors = props.currentFilters.colors.filter(x => x !== color)
        }
        else {
            props.currentFilters.colors.push(color)
        }
    } else {
        props.currentFilters.colors = [color]
    }
}

function applyFilters() {
    emit('update:currentFilters', page);
}

</script>

<style lang="scss" scoped></style>