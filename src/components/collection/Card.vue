<template>
    <div v-for="(card, index) in localCollection" :id="index" class="relative">
        <div v-if="card.treatment === 'foil'" class="absolute top-0 left-0 w-full h-full rainbow-bg"></div>
        <img v-if="card.image.hasDouble" src="/images/repeat.png"
            class="w-10 h-10 absolute end-2 bottom-1 cursor-pointer transition-all duration-300"
            @click="() => card.image.showBack = !card.image.showBack" :class="{ 'rotate-180': card.image.showBack }" />
        <img v-show="!card.image.showBack" :src="card.image.faceUp" />
        <img v-show="card.image.showBack && card.image.hasDouble" :src="card.image.faceDown" />
    </div>
</template>

<script setup>
defineProps({})
</script>

<style lang="scss" scoped></style>