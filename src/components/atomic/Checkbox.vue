<template>
    <div class="content-child flex flex-row gap-2 items-center h-6 hover:font-bold hover:cursor-pointer">
        <input v-bind="$attrs" type="checkbox" :id="id" class="hover:cursor-pointer"
            @change="$emit('update', !checked)" />
        <label :for="id" class="hover:cursor-pointer">{{ label }}</label>
    </div>
</template>

<script setup>
defineEmits(['update']);
defineProps({
    id: {
        type: String,
        default: '',
    },
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