<template>
    <div class="flex flex-row gap-2 items-center h-6 hover:font-bold hover:cursor-pointer">
        <input v-bind="$attrs" type="checkbox" id="checkbox" :value="checked" @change="$emit('update', !checked)"
            class="hover:cursor-pointer" />
        <label for="checkbox" class="hover:cursor-pointer">{{ label }}</label>
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