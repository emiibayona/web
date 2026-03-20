<template>
    <div class="compressor-wrapper" :ref="attrs.id">
        <slot name="selected"></slot>
        <div class="header-wrapper" @click="toggle"
            :class="[{ expanded, 'notSpace': iconNextToContent, 'ended': contentEnd }]">
            <slot name="title"></slot>
            <img v-if="!alwaysOpen && icon && !bottomArrow && !withoutArrow" :src="icon" class="icon" :class="{
                'is-expanded': expanded,
                'big': big,
                'mid': mid,
                'end': arrowEnd
            }" />
        </div>
        <div class="expandable-container"
            :class="[{ 'expanded': alwaysOpen || expanded }, { speedy }, { 'isShadow': shadow }]">
            <slot name="content"></slot>
        </div>
        <div v-if="bottomArrow && !withoutArrow" class="header-wrapper center mt-2 mb-4" @click="toggle"
            :class="[{ expanded }]">
            <img src="/images/arrow-up.png" class="icon" :class="{
                'big': big,
                'mid': mid,
                'transition-all duration-300 ease-in-out': !staticArrow,
                'is-expanded': expanded,
                'is-bouncing': !expanded && !staticArrow
            }" />
        </div>
    </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, onUnmounted, ref, watch } from 'vue';
import { useAttrs } from 'vue'
import useClickOutside from '@/composables/useClickOutside';
import useDevices from '@/composables/useDevices';

const devices = useDevices();

const attrs = useAttrs()
const props = defineProps({
    // 
    icon: { type: Boolean, default: '/images/bleach.png' },
    iconNextToContent: { type: Boolean, default: false },
    contentEnd: { type: Boolean, default: false },
    shadow: { type: Boolean, default: false },
    // upper:{}
    // Behaiviour
    alwaysOpen: { type: Boolean, default: false },
    speedy: { type: Boolean, default: false },
    withoutMove: { type: Boolean, default: false },
    mobile: { type: Boolean, default: false },
    // Arrow
    big: { type: Boolean, default: false },
    mid: { type: Boolean, default: false },
    withoutArrow: { type: Boolean, default: false },
    bottomArrow: { type: Boolean, default: false },
    staticArrow: { type: Boolean, default: false },
    arrowEnd: { type: Boolean, default: false },
});
let overlay = null;
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
watch(expanded, () => {
    console.log(expanded.value)
    if (props.mobile) {
        if (expanded.value) {
            overlay.classList.add('active');
        } else {
            overlay.classList.remove('active');
        }
    }
})
const { setListener } = useClickOutside({ templateRef: attrs.id, target: expanded, clicked: false });
onMounted(() => {
    overlay = document.getElementById('overlay');
    setListener();
})
onBeforeUnmount(() => { setListener(); expanded.value = false; })
defineExpose({ toggle, setExpanded: (val) => expanded.value = val });

</script>

<style lang="scss" scoped>
.compressor-wrapper {
    z-index: 1000;
    @include flex(column, flex-start, flex-start);

    .header-wrapper {
        @include flex(row, space-between, center);
        width: 100%;
        cursor: pointer;

        &.center {
            justify-content: center;
        }

        &.notSpace {
            justify-content: flex-start;
            gap: 8px;
        }

        &.ended {
            justify-content: flex-end;

        }

        .icon {
            height: 10px;
            width: 10px;
            transform: rotate(-180deg);
            transition: all 0.5s ease-in-out;

            &.mid {
                height: 18px;
                width: 18px;
            }

            &.big {
                height: 24px;
                width: 24px;
            }

            &.end {
                align-self: flex-end;
                margin-bottom: 8px;
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
                transform: rotate(180deg) translateY(-25%);
                animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
            }

            50% {
                transform: rotate(180deg) translateY(0);
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

        &.isShadow {
            filter: drop-shadow(#301934 2px 5px 5px);
        }


    }
}
</style>