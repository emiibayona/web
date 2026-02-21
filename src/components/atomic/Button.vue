<template>
    <button :class="[
        'btn',
        `btn--${size}`,
        {
            'btn--outlined': outlined,
            'btn--disabled': disabled
        }
    ]" :style="{ '--btn-color': color }" :disabled="disabled" v-bind="$attrs">
        <slot />
    </button>
</template>

<script setup>
defineProps({
    size: {
        type: String,
        default: 'md',
        validator: (value) => ['xxsmall', 'xsmall', 'small', 'md', 'lg', 'block'].includes(value)
    },
    color: {
        type: String,
        default: '#FFE18E'
    },
    outlined: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        default: "button"
    }
});
</script>

<style lang="scss" scoped>
.btn {
    border: 2px solid var(--btn-color);
    border-radius: 6px;
    font-weight: 600;
    transition: all 0.2s ease;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    white-space: nowrap;
    background-color: var(--btn-color);
    color: black;
    height: 40px;
    width: max-content;




    &:hover:not(.btn--disabled) {
        opacity: 0.85;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

    }

    &:active:not(.btn--disabled) {

        transform: translateY(0);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    padding: 8px;

    // Sizes
    &--xxsmall {
        // padding: 4px 8px;
        font-size: 12px;
        min-height: 20px;
        height: 32px;
    }

    &--xsmall {
        // padding: 6px 12px;
        padding: 4px;
        font-size: 12px;
        min-height: 18px;
        height: 32px;
    }

    &--small {
        // padding: 8px 16px;
        font-size: 14px;
        min-height: 32px;
    }

    &--md {
        // padding: 12px 24px;
        font-size: 16px;
        min-height: 40px;
    }

    &--lg {
        // padding: 16px 32px;
        padding: 8px 16px;
        font-size: 18px;
        min-height: 48px;
    }

    &--block {
        width: 100%;
    }

    // Outlined state
    &--outlined {
        background-color: transparent;
        // color: var(--btn-color);
        // border-color: var(--btn-color);
        color: black;
        border-color: black;

        &:hover:not(.btn--disabled) {
            background-color: var(--btn-color);
            // border-width: 2px;
            // color: white;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            // transform: translateY(-2px);
        }
    }

    // Disabled state
    &--disabled {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none;
    }
}
</style>