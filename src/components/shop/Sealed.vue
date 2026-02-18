<template>
    <div class="sealed-wrap">
        <div class="sealed-img">
            <img :src="value.image" />
        </div>
        <div class="sealed-wrap-info">
            <div class="titles">
                <span class="title">{{ value.name }}</span>
                <p class="description">{{ value.description }}</p>
            </div>
            <div class="flex flex-col items-center gap-3">
                <span v-if="value.stock" class="font-bold">Stock: <span class="font-normal"> {{ value.stock
                        }}</span></span>
                <span class="font-bold">Price: <span class="font-normal"> {{ value.price }}</span></span>
                <Button :disabled="isSoldOut" :outlined="isSoldOut" @click="addToCart">{{ isSoldOut ? 'Agotado' :
                    "Comprar"
                }}</Button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import Button from '../atomic/Button.vue';
import useCarts from '@/composables/useCart';
import { GAMES } from '@/utils/constants';
const props = defineProps({
    value: {
        type: Object,
        required: true
    }
});

const { add } = useCarts(GAMES.MAGIC)
const isSoldOut = computed(() => !props.value.stock || props.value.soldOut)
const addToCart = () => {
    add({ item: props.value, quantity: 1, sealed: true })
}
</script>

<style lang="scss" scoped>
.sealed-wrap {
    @include flex(row, flex-start, flex-start);
    gap: 12px;
    border-bottom: 2px solid black;
    padding: 8px 4px;
    // min-height: 150px;
    // max-height: 250px;
    height: clamp(150px, 170px, 250px);

    .sealed-img {
        height: 150px;
        width: auto;

        img {

            object-fit: contain;
        }

    }

    &-info {
        width: 100%;
        min-height: 150px;
        max-height: 250px;
        @include flex(row, space-between, flex-end);

        .titles {
            min-height: 150px;
            max-height: 250px;
            max-width: 50%;
            @include flex(column, flex-start, flex-start);
            gap: 8px;

            .title {
                font-weight: bold;
                font-size: 20px;
            }

            .description {
                font-size: small;
            }
        }
    }
}
</style>