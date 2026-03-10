<template>
    <div class="w-full flex flex-col gap-10 items-center mt-20 nm:gap-5">
        <h1 class="font-black text-2xl nm:text-3xl text-center">
            ¡¡¡Pronto traeremos más novedades!!!
        </h1>
        <span class="font-bold text-xl nm:text-2xl">Pero mientras tanto....</span>
        <div class="flex flex-col nm:flex-row gap-10 nm:gap-20">
            <a href="https://www.instagram.com/geartowntcg/" target="_blank"
                class="flex flex-row items-center gap-2 animated"><img src="/images/instagram.png"
                    class="w-16 h-16" /><span class="">Vísitanos en nuestro Instagram</span></a>
            <span class="flex flex-row items-center gap-2 animated" @click="toWpp"><img src="/images/whatsapp.png"
                    class="w-16 h-16" /><span class="">Contáctanos por
                    Whatsapp</span></span>
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