<template>
    <div class="flip-container" :class="{ 'hasDouble': card.image.hasDouble }">
        <div class="card relative">
            <div class="quantity">
                {{ card.quantity }}
            </div>
            <div v-if="card.treatment === 'foil'" class="absolute top-0 left-0 w-full h-full rainbow-bg z-10">
            </div>
            <img :src="card.image.faceUp" class="front" />
            <img :src="card.image.faceDown" class="back" />
        </div>
    </div>
</template>

<script setup>
defineProps({
    card: { type: Object, default: () => ({}) }
})
</script>

<style lang="scss" scoped>
.flip-container {
    background-color: transparent;
    border: 1px solid #ccc;
    perspective: 1000px;
    width: 215px;
    height: 300px;
}

.card {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 1s;
    transform-style: preserve-3d;

    perspective: 1000px;

    .quantity {
        // absolute top-10 right-4 z-20 rounded-md bg-gray-800 h-6 w-7 flex flex-row justify-center items-center
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 4px;
        height: 24px;
        width: 30px;
        background-color: rgb(211, 211, 211, 0.5);
        top: 40px;
        right: 30px;
        z-index: 20;
        cursor: default;
        transition: opacity 1s;
        transform-style: preserve-3d;
        font-weight: bold;

    }
}

.flip-container {
    &.hasDouble:hover {
        .card {
            transform: rotateY(180deg);

            .quantity {
                // transform: rotateY(180deg);
                opacity: 0;
            }
        }

    }
}

.front,
.back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 5rem;
}

.back {
    transform: rotateY(180deg);
}
</style>