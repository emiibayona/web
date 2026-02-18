<template>
    <div class="w-full flex flex-col gap-10 items-center mt-20">
        <h1 class="font-black text-5xl">
            ¡¡¡ Sección en construcción, pronto traeremos mas novedades !!!
        </h1>
        <span class="text-3xl">Pero mientras tanto....</span>
        <div class="flex flex-row gap-20">
            <a href="https://www.instagram.com/geartowntcg/" target="_blank"
                class="flex flex-row items-center gap-2 animated"><img src="src/assets/img/instagram.png"
                    class="w-16 h-16" /><span class="font-bold">Vísitanos en nuestro Instagram</span></a>
            <span class="flex flex-row items-center gap-2 animated" @click="toWpp"><img
                    src="src/assets/img/whatsapp.png" class="w-16 h-16" /><span class="font-bold">Contactanos por
                    whatsapp</span></span>
        </div>
    </div>
</template>

<script setup>
function toWpp() {
    window.open(`https://wa.me/${import.meta.env.VITE_CONTACT_PHONE}?text=Hola, vine a través de su web, quería hacer unas consultas!!!`, '_blank');
}
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