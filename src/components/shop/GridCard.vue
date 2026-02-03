<template>
    <div class="flex flex-row justify-center" ref="root">
        <div class="flex flex-col gap-4 p-4  max-w-[250px]">
            <div class="group relative max-w-max">
                <div v-if="isFoil"
                    class="rainbow-bg absolute top-0 h-full w-full z-[2] transition-all duration-300 ease-in-out"
                    :class="[{ 'scale-150': zoomed }]"></div>
                <img class="block border-black duration-300 ease-in-out " :class="[{ 'scale-150': zoomed }]"
                    :title="title + '(' + expansion + ')'" :alt="title + '(' + expansion + ')'" loading="eager"
                    :src="image">
                <div class="absolute opacity-0 flex justify-center items-center text-white  bottom-4 transition-all duration-300 ease-in-out bg-black rounded-full cursor-pointer p-1 text-xl  ring-white group-hover:opacity-80 z-10"
                    :class="[{ '-right-9 -bottom-[50px] h-10 w-10 ring-2': zoomed }, { 'right-2 h-6 w-6 ring-1': !zoomed }]"
                    @click=" zoomed = !zoomed">
                    <span class="flex justify-center items-center"> {{ zoomed ? "-" : "+" }}</span>
                </div>
            </div>
            <div class="flex flex-col gap-0">
                <span class="text-bold">{{ title }}</span>
                <span class="font-thin text-xs">{{ expansion }}</span>
            </div>
            <div v-if="fromShop" class="flex flex-col gap-2 border-t-2 border-black py-2">
                <div class="flex flex-col gap-2">
                    <span class="font-bold">Disponibles: <span class="font-normal">1</span></span>
                    <span class="font-bold">{{ price }} USD <span class="font-thin text-xs">{{
                        `(${uyPrice} UYU)`
                            }}</span></span>
                    <div class=" flex flex-col space-y-1">
                        <p class="group font-bold text-blue-600 hover:cursor-pointer hover:text-blue-900 ">Agregar al
                            carrito
                            <span
                                class="block bg-blue-600 h-0.5 scale-0 origin-left transition-transform duration-500 ease-in-out group-hover:scale-100"></span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import useClickOutside from '@/composables/useClickOutside';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const props = defineProps({
    title: {
        type: String,
        default: "Hexing Squelcher",
    },
    expansion: {
        type: String,
        default: "Lorwyn Eclipsed (R)",
    },
    image: {
        type: String,
        default: "https://cards.scryfall.io/large/front/6/7/674960ce-ff33-4d5e-a24a-a4582b2e9809.jpg?1767658306",
    },
    description: {
        type: String,
        default: "This is a description for the card.",
    },
    price: {
        type: String,
        default: null,
    },
    fromShop: { type: Boolean, default: false },
    isFoil: { type: Boolean, default: false }
});

const zoomed = ref(false);
const { setListener } = useClickOutside({ templateRef: "root", target: zoomed, clicked: false });

const uyPrice = computed(() => {
    if (!props.price) return "N/A";
    const uyPrice = (parseFloat(props.price) * 40).toFixed(2); // Example conversion rate
    return uyPrice;
})

onMounted(() => setListener())
onBeforeUnmount(() => setListener())

</script>

<style lang="scss" scoped></style>