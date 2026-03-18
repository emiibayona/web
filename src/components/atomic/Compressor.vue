<template>
    <div class="compressor-wrapper" :ref="attrs.id">
        <slot name="selected"></slot>
        <div class="header-wrapper" @click="toggle" :class="[{ expanded }]">
            <slot name="title"></slot>
            <img v-if="!alwaysOpen && icon && !bottomArrow" src="/images/bleach.png" class="icon"
                :class="{ 'is-expanded': expanded }" />
        </div>
        <div class="expandable-container" :class="[{ 'expanded': alwaysOpen || expanded }, { speedy }]">
            <slot name="content"></slot>
        </div>
        <div v-if="bottomArrow" class="header-wrapper center mb-4" @click="toggle" :class="[{ expanded }]">
            <img src="/images/arrow-up.png" class="icon big transition-all duration-300 ease-in-out"
                :class="{ 'is-expanded': expanded, 'is-bouncing': !expanded }" />
        </div>
    </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, onUnmounted, ref } from 'vue';
import { useAttrs } from 'vue'
import useClickOutside from '@/composables/useClickOutside';
import useDevices from '@/composables/useDevices';

const devices = useDevices();

const attrs = useAttrs()
defineProps({
    alwaysOpen: { type: Boolean, default: false },
    icon: { type: Boolean, default: true },
    speedy: { type: Boolean, default: false },
    withoutMove: { type: Boolean, default: false },
    bottomArrow: { type: Boolean, default: false },
});
const expanded = ref(false)
const toggle = () => {
    expanded.value = !expanded.value
    if (devices.width.value > 999 && !props.withoutMove) {
        setTimeout(() => {
            if (expanded.value && attrs.id) {
                document.getElementById(attrs.id)?.scrollIntoView({ behavior: "smooth" })
            }
        }, 500);
    }
};
const { setListener } = useClickOutside({ templateRef: attrs.id, target: open, clicked: false });
onMounted(() => setListener())
onBeforeUnmount(() => { setListener(); expanded.value = false; })
defineExpose({ toggle });

</script>

<style lang="scss" scoped>
.compressor-wrapper {
    @include flex(column, flex-start, flex-start);

    .header-wrapper {
        @include flex(row, space-between, center);
        width: 100%;
        cursor: pointer;

        &.center {
            justify-content: center;
        }

        .icon {
            height: 10px;
            width: 10px;
            transform: rotate(-180deg);
            transition: all 0.5s ease-in-out;

            &.big {
                height: 24px;
                width: 24px;
            }

            &.is-expanded {
                transform: rotate(0deg);
            }

            &.is-bouncing {
                animation: bounce-custom 1s infinite;
            }
        }

        @keyframes bounce-custom {

            0%,
            100% {
                transform: rotate(-180deg) translateY(-25%);
                animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
            }

            50% {
                transform: rotate(-180deg) translateY(0);
                animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
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
            padding: unset;
        }

        &.speedy {
            transition: grid-template-rows 0.2s ease-in-out;
        }

        &.expanded {
            grid-template-rows: 1fr;
            padding: auto;
        }

        &.with-border {
            :deep(.content) {
                margin-top: 4px;
                border-bottom: 2px solid black;

            }
        }


    }
}
</style>