<template>
    <div class="flex flex-row gap-2 items-center h-6">
        <input v-bind="$attrs" type="checkbox" id="checkbox" :value="checked" @change="$emit('update', !checked)" />
        <label for="checkbox">{{ label }}</label>
    </div>
</template>

<script setup>
defineEmits(['update']);
defineProps({
    checked: {
        type: Boolean,
        default: false,
    },
    label: {
        type: String,
        default: '',
    },
});
</script>

<style lang="scss" scoped></style>