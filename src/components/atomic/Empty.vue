<template>
    <div class="w-full flex flex-col justify-center text-center items-center font-bold text-xl mt-20 mb-5 px-5">
        <span>
            {{ title }}
        </span>
        <slot></slot>
    </div>
</template>

<script setup>
defineProps({ title: { type: String, default: "No hay resultados para esta pantalla o busqueda." } })
</script>

<style lang="scss" scoped></style>