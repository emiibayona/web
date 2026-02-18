<template>
    <div class="w-full flex flex-col gap-10 items-center mt-20">
        <h1 class="font-black text-5xl">
            Ups, pagina no encontrada !!!
        </h1>
        <a href="/" target="" class="flex flex-row items-center gap-2 animate-bounce animated">
            <span class="font-bold">Puedes volver al inicio desde aquí !!!</span>
        </a>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.animated {
    transition: transform 0.5s ease-in;
    cursor: pointer;

    &:hover {
        transform: scale(1.2);
    }
}
</style>