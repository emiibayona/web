<template>
    <div class="compressor-wrapper">
        <div class="header-wrapper" @click="toggle" :class="[{ expanded }]">
            <slot name="title"></slot>
            <img v-if="!alwaysOpen && icon" src="/public/images/bleach.png" class="icon" />
        </div>
        <div class="expandable-container" :class="[{ 'expanded': alwaysOpen || expanded }, { speedy }]">
            <slot name="content"></slot>
        </div>
    </div>
</template>

<script setup>
import { onUnmounted, ref } from 'vue';

defineProps({
    alwaysOpen: { type: Boolean, default: false },
    icon: { type: Boolean, default: true },
    speedy: { type: Boolean, default: false }
});
const expanded = ref(false)
const toggle = () => expanded.value = !expanded.value;
onUnmounted(() => expanded.value = false)
defineExpose({ toggle });

</script>

<style lang="scss" scoped>
.compressor-wrapper {
    @include flex(column, flex-start, flex-start);

    .header-wrapper {
        @include flex(row, space-between, center);
        width: 100%;
        cursor: pointer;

        .icon {
            transition: transform 0.5s ease;
            height: 10px;
            width: 10px;
            transform: rotate(-180deg);
        }

        &.expanded {
            .icon {
                transform: rotate(0deg);
            }
        }
    }


    .expandable-container {
        display: grid;
        grid-template-rows: 0fr;
        transition: grid-template-rows 0.5s ease-in-out;
        overflow: hidden;

        width: 100%;

        :deep(.content) {
            width: 100%;
            min-height: 0;
            border: none;
        }

        &.speedy {
            transition: grid-template-rows 0.2s ease-in-out;
        }

        // :deep(.content-child) {
        //     opacity: 0;
        //     transition: opacity 0.5s ease;
        // }

        &.expanded {
            grid-template-rows: 1fr;
            // transition: all 0.5s ease-in-out;

            // :deep(.content-child) {
            //     opacity: 1;
            // }
        }

        &.with-border {
            // transition: border 0.5s ease-in-out;

            :deep(.content) {
                // transition: border-bottom 0.2s ease-in-out;
                margin-top: 4px;
                border-bottom: 2px solid black;

            }
        }


    }
}
</style>